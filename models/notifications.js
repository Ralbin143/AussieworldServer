const mongoose = require('mongoose')

const notificationsSchema = new mongoose.Schema({
    userId:{
        
    },
    sslc:{
        type:String,
        requred:false
      },
      hsc:{
        type:String,
        requred:false
      },
      degree:{
        type:String,
        requred:false
      },
      aadhar:{
        type:String,
        requred:false
      },
      passport:{
        type:String,
        requred:false
      },
      experence:{
        type:String,
        requred:false
      },
      individualAffidavit:{
        type:String,
        requred:false
      },
      loanSanctionLetter:{
        type:String,
        requred:false
      },
      fd:{
        type:String,
        requred:false
      },
      propertyvaluation:{
        type:String,
        requred:false
      }
})

module.exports = mongoose.model('notifications', notificationsSchema)