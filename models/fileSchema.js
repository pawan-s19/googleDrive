//user model
var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  parent: String,
  filename: String,
  fileId: { type: mongoose.Schema.Types.ObjectId },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("fileModel", fileSchema);
