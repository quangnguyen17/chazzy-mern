const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        minlength: [2, `'First Name' must at least be 2 characters.`]
    },
    lastName: {
        type: String,
        require: true,
        minlength: [2, `'Last Name' must at least be 2 characters.`]
    },
    username: {
        type: String,
        require: true,
        minlength: [5, `'Username' must at least be 5 characters.`]
    },
    password: {
        type: String,
        require: true,
        minlength: [8, `'Password' must at least be 8 characters.`]
    }
}, { timestamps: true });

UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

UserSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});

UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
