//user model
var mongoose=require('mongoose');


var folderSchema= new mongoose.Schema({
 name:String,
 content:[{type:mongoose.Schema.Types.ObjectId}]

},{timestamps:true})


module.exports=mongoose.model('folderModel',folderSchema)
