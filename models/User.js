const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    userId:{
        type:String,
        required:true
    },
    middleName:{
        type: String,
        required: false,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    guidance:{
       type:Array,
       required:false
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    Qulaification:{
        type:Array,
        required:false
    },
    refreshToken: {
      type: String,
    },
    applicantType:{
        type:String,
        required:false
    },
    passportNo:{
        type:String,
        required:false
    },
    countryofBirth:{
        type:String,
        required:false
    },
    residentialAddress:{
        type:String,
    },
    adhaarNo:{
      type:String
    },
    anyQueries:{
        type:String,
        required:false
    },
    userStatus:{
        type:String,
        requred:false
    },
    role:{
        type:String,
        default:"User"
    },
    updatePassword:{
       type:Boolean,
       default:false 
    },
    created_at: {
      type: Date,
      default: new Date(),
      required: true,
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
    },
    userDocs:{
      type:Array,
      required:false
    },
    

  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);