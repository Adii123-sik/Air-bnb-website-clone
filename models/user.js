const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


// Defining the User schema
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});
// Adding passport-local-mongoose plugin to the User schema
userSchema.plugin(passportLocalMongoose);
// Exporting the User model
module.exports=mongoose.model('User',userSchema);