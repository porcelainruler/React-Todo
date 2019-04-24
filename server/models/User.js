const mongoose = require("mongoose");
const UserSchema = require("../schemas/User");
const User = mongoose.model("UserBox",UserSchema);

module.exports = User;

