const jwt = require("jsonwebtoken");

// SECRET KEY
const secret = "I can't believe this key is so secret!";
module.exports.secret = secret;

// AUTHENTICATE
module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.usertoken, secret, (err, payload) => {
        if (err) {
            res.status(401).json({ verified: false });
        } else {
            next();
        }
    });
}

