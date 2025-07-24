const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// Defining the Listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
   image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },  
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
    
  },
});
// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
  }
   
});
//  Defining the Listing model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;