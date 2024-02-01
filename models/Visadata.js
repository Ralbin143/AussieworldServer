const mongoose = require("mongoose")
var visaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: false
    },
    familyDocument:{
        type:Array,
        required:false
    },
    itr:{
        type:String,
        required:false
    },
    sponsorDetails:{
        type:Array,
        required:false
    },
    relationshipStatement:{
        type:String,
        required:false
    },
    loanSanction:{
        type:String,
        required:false
    },
    fd:{
        type:String,
        required:false
    },
    propertyValuation:{
        type:String,
        required:false
    }
})
module.exports = mongoose.model("visa",visaSchema);