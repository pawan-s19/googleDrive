//user model
var mongoose=require('mongoose');
var plm=require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/oneok')
.then(function(){
  console.log('hey')
})

var userSchema=mongoose.Schema({
  username:String,
  password:String,
  email:{
    type:String,
    unique: true,
    required: true
  }
})

userSchema.plugin(plm);

module.exports=mongoose.model('user',userSchema)
