//user model
var mongoose=require('mongoose');
var plm=require('passport-local-mongoose');

mongoose.connect('mongodb+srv://Sushant_8083:Sushant%402003@cluster0.eqii0la.mongodb.net/?retryWrites=true&w=majority')
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
