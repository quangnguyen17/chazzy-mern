const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { secret } = require('../config/jwt.config');

// Models
const User = require('../models/User');
const Message = require('../models/Message');

// User
module.exports.fetch = (req, res) => {
    const decoded = jwt.decode(req.cookies.usertoken, { complete: true });
    const userID = decoded.payload._id;

    User.find()
        .then(users => {
            let loggedInUser = null;
            let otherUsers = [];
            for (let index = 0; index < users.length; index++) {
                const user = users[index];
                (user._id == userID) ? loggedInUser = user : otherUsers.push(user);
            }

            Message.find({ $or: [{ senderID: userID }, { receiverID: userID }] })
                .sort({ createdAt: 1 })
                .exec((err, messages) => {
                    if (err) {
                        return res.json(err);
                    }

                    let groupedMessages = {};
                    for (let index = 0; index < messages.length; index++) {
                        const message = messages[index];
                        const prepUserID = (message.senderID == userID) ? message.receiverID : message.senderID;
                        groupedMessages.hasOwnProperty(prepUserID) ? groupedMessages[prepUserID] = groupedMessages[prepUserID].concat([message]) : groupedMessages[prepUserID] = [message];
                    }

                    return res.json({ otherUsers, loggedInUser, groupedMessages });
                });
        })
        .catch(err => res.json(err))
}

module.exports.register = (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(() => {
            res.cookie('usertoken', jwt.sign({ _id: user._id }, secret), { httpOnly: true })
                .json({ msg: "success", user: user });
        })
        .catch(err => res.json(err));
}

module.exports.logout = (req, res) => {
    res.clearCookie("usertoken", { path: '/' });
    res.json({ msg: 'cookies cleared, user logged out.' });
}

module.exports.login = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(user => {
            if (user === null) {
                res.json({ msg: `User not found with username ${username}` });
            } else {
                bcrypt.compare(password, user.password)
                    .then(passwordValid => {
                        if (passwordValid) {
                            res.cookie('usertoken', jwt.sign({ _id: user._id }, secret), { httpOnly: true })
                                .json({ msg: 'success' });
                        } else {
                            res.json({ msg: `Invalid Password, Please try again! :(` });
                        }
                    }).catch(err => res.json({ msg: `Invalid Login Attempt, Please try again! :(` }));
            }
        }).catch(err => res.json(err));
}

module.exports.deleteAll = (req, res) => {
    User.deleteMany()
        .then(data => res.json(data))
        .catch(err => res.json(err))
}

// Message
module.exports.getAllMessages = (req, res) => {
    Message.find()
        .sort({ createdAt: -1 })
        .exec((err, messages) => {
            if (err) {
                return res.json(err);
            }

            return res.json(messages);
        })
}

module.exports.getMessages = (req, res) => {
    Message.find({ senderID: req.params.senderID })
        .sort({ createdAt: -1 })
        .exec((err, messages) => {
            if (err) {
                return res.json(err);
            }

            return res.json(messages);
        })
}

module.exports.sendMessage = (req, res) => {
    Message.create(req.body)
        .then(createdMessage => res.json({ message: createdMessage }))
        .catch(err => res.json(err));
}
