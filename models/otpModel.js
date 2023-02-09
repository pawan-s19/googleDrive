const {Schema, model} = require('mongoose');

const otpSchema = new Schema({
    otp: {
        type: String,
        maxLength: [6, "OTP Cannot exceed 6 characters"]
    },
    email: String,
    otpExpiry: Date
});

module.exports = model('otp', otpSchema);