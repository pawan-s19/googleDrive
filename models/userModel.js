//user model
var mongoose=require('mongoose');
var plm=require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/gridfs')
.then(function(data){
  console.log(`Database connected\nServer running at port : ${data.connection.host}`);
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
