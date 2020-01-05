var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var accountSchema = new Schema({
  id: String,
  password: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("account", accountSchema);
