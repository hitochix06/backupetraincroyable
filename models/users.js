// Insert your code here
const mongoose = require("mongoose");

const uid2 = require("uid2");

const usersSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  token: {
    type: String,
    default: uid2(32),
  },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }], // mes reservations
});

const User = mongoose.model("users", usersSchema);

module.exports = User;
