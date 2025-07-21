const mongoose=require("mongoose");


const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },


});




//  Defining the Review model

const Review=mongoose.model("Review",reviewSchema);

// Exporting the Review model   

module.exports=Review;