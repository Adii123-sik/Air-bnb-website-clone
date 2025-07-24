const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIN,isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewsController = require("../controllers/reviews.js");





//post review route
// Create a new review for a specific listing and redirect to the listing's show page
router.post("/",isLoggedIN, validateReview, wrapAsync(reviewsController.createReview));

//delete review route
// Delete a specific review by ID, remove it from the listing, and redirect to the listing's show page
router.delete("/:reviewId",isLoggedIN,isReviewAuthor, wrapAsync(reviewsController.deleteReview));


module.exports=router;