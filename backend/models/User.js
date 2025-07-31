const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
