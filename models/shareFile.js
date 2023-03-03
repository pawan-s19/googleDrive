const mongoose = require('mongoose')

const shareFile = new mongoose.Schema({
  path : {
    type : mongoose.Schema.Types.ObjectId,
    require : true
  },
  originalname :{
    type : String ,
    require : true
  },
  password : String,
  download : {
    type : Number , 
    default : 0 , 
    require : true
  }
})

module.exports = mongoose.model("shareFile", shareFile)
