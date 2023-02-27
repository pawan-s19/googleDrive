const mongoose = require('mongoose')

const shareFile = new mongoose.Schema({
  path : {
    type : String,
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
