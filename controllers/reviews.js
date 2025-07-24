const Review = require('../models/review');
const Listing = require('../models/listing');

// create review callback function
module.exports.createReview = async (req, res) => {

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author of the review to the current user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
   req.flash("success","new review added");
  res.redirect(`/listings/${listing._id}`);
}


// delete review callback function
module.exports.deleteReview = async (req, res) => {

  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

   req.flash("success","review deleted");

  res.redirect(`/listings/${id}`);
};