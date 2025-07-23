const express=require("express");

const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIN, isOwner,validateListing}=require("../middleware.js");



//index route
// Fetch all listings and render the index page
router.get("/",wrapAsync( async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render("Listings/index.ejs",{allListings});

}));




// Render the form to create a new listing
router.get("/new", isLoggedIN, (req,res)=>{
    res.render("Listings/new.ejs");
});


//show route
// Fetch a specific listing by ID and render the show page
router.get("/:id", wrapAsync( async (req,res)=>{

    let {id}=req.params;
  let listing= await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listings");
  }
   res.render("Listings/show.ejs",{listing});


}));

//Create Route
// Create a new listing and redirect to the index page
router.post("/", isLoggedIN, validateListing, wrapAsync( async (req, res ,next) => {

   const newListing = new Listing(req.body.listing);
   newListing.owner=req.user._id; // Associate the listing with the logged-in user   
  await newListing.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
 
}));

//edit route
// Fetch a specific listing by ID and render the edit form
router.get("/:id/edit",isLoggedIN,isOwner, wrapAsync( async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("Listings/edit.ejs",{listing});
    
}));



//Update Route
// Update a specific listing by ID and redirect to the show page
router.put("/:id", isLoggedIN, isOwner, validateListing, wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing updated");
  res.redirect(`/listings/${id}`);
}));

// delete listing route
// Delete a specific listing by ID and redirect to the index page 
router.delete("/:id", isLoggedIN ,isOwner, wrapAsync( async (req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id); 
   req.flash("success","listing deleted");
    res.redirect("/listings");
}));

module.exports=router;
