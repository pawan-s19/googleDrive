//user model
var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  parent: String,
  filename: String,
  fileId: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model("fileModel", fileSchema);
