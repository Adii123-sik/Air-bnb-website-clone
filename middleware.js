// middleware.js
const Listing = require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
// Middleware to check if user is logged in
module.exports.isLoggedIN=(req,res,next)=>{
    if(!req.isAuthenticated()){
req.session.redirectUrl=req.originalUrl; 
  req.flash("error","You must be logged in to create a listing");
  return res.redirect("/login");
        
    
}
next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
};


// Middleware to check if the user is the owner of the listing
module.exports.isOwner=(req,res,next)=>{
    const {id}=req.params;
    Listing.findById(id).then((listing)=>{
        if(!listing.owner._id.equals(req.user._id)){
            req.flash("error","You do not have permission to do that beacause you are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }).catch(err=>{
        req.flash("error","Listing not found");
        res.redirect("/listings");
    });
};


// Middleware to validate listing data
module.exports.validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }
};


// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {

  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");

    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};