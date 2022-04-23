const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

const User = mongoose.model(
    "User",
    new mongoose.Schema({
      customerName: String,
      email: String,
      password: String,
      role: String,
      balance: Number
    })
  );


db.user = User;


module.exports = db;