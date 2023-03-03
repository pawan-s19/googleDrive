//user model
var mongoose = require("mongoose");

var folderSchema = new mongoose.Schema(
  {
    name: String,
    parent: {type:String},
    folders: [{ type: mongoose.Schema.Types.ObjectId,ref:"folderModel" }],
    files: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("folderModel", folderSchema);
