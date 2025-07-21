const express=require("express");

const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");



const validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }
};


// index route

router.get("/",wrapAsync( async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render("Listings/index.ejs",{allListings});

}));



// route for form of add new Listing

router.get("/new",(req,res)=>{

 res.render("Listings/new.ejs");    

});


//show route

router.get("/:id", wrapAsync( async (req,res)=>{

    let {id}=req.params;
  let listing= await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listings");
  }
   res.render("Listings/show.ejs",{listing});


}));

//Create Route
router.post("/", validateListing, wrapAsync( async (req, res ,next) => {
  
   const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
 
}));

//edit route

router.get("/:id/edit",wrapAsync( async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("Listings/edit.ejs",{listing});
    
}));



//Update Route
router.put("/:id", validateListing, wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing updated");
  res.redirect(`/listings/${id}`);
}));

// delete listing route

router.delete("/:id", wrapAsync( async (req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id); 
   req.flash("success","listing deleted");
    res.redirect("/listings");
}));

module.exports=router;
