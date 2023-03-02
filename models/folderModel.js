//user model
var mongoose = require("mongoose");

var folderSchema = new mongoose.Schema(
  {
    name: String,
    parent: [{ type: mongoose.Schema.Types.ObjectId, ref: "folderModel" }],
    folders: [{ type: mongoose.Schema.Types.ObjectId }],
    files: [{ type: String }],
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("folderModel", folderSchema);
