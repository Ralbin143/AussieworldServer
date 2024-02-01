const mongoose = require("mongoose"); 
var guidanceSchema = new mongoose.Schema(
  {
    guidanceName: {
      type: String,
      required: true,
    },
    title:{
        type:String,
        required:true
    },
    images:{
        type: Array,
        required: false,
    },
    subtitle: {
      type: String,
      required:false,
    },
    description: {
      type: String,
      required: false,
    },
    download: {
      type: String,
      required:false,
 },
    createdAt:{
        type:Date
    }
}
);



module.exports = mongoose.model("Guidance", guidanceSchema);