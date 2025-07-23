const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIN,isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");






//post review route
// Create a new review for a specific listing and redirect to the listing's show page
router.post("/",isLoggedIN, validateReview, wrapAsync(async (req, res) => {

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author of the review to the current user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
   req.flash("success","new review added");
  res.redirect(`/listings/${listing._id}`);

}));

//delete review route
// Delete a specific review by ID, remove it from the listing, and redirect to the listing's show page
router.delete("/:reviewId",isLoggedIN,isReviewAuthor, wrapAsync(async (req, res) => {

  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

   req.flash("success","review deleted");

  res.redirect(`/listings/${id}`);
}));


module.exports=router;