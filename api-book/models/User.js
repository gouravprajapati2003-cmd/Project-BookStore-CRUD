const mongoose = require('mongoose');
//const timestamps = require('mongoose-timestamps');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, },
    lastLogin: { type: Date },
    userType: { type: String, default: 'user', enum: ['user', 'admin'] },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    createdAt: Date,
    updatedAt: Date,
})
//userSchema.plugin(timestamps, {index:true});
module.exports = mongoose.model('User', userSchema);