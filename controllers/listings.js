const Listing = require("../models/listing");



//index callback function
module.exports.index=async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render("Listings/index.ejs",{allListings});
};

// render new form callback function
module.exports.renderNewForm=(req,res)=>{
    res.render("Listings/new.ejs");
};

// show callback function
module.exports.showListing=async (req,res)=>{

    let {id}=req.params;
  let listing= await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listings");
  }
   res.render("Listings/show.ejs",{listing});
};

// create listing callback function

module.exports.createListing=async (req, res ,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
   
   const newListing = new Listing(req.body.listing);
   newListing.owner=req.user._id; // Associate the listing with the logged-in user   
   newListing.image.url=url;
   newListing.image.filename=filename;
  await newListing.save(); 
  req.flash("success","new listing created");
  res.redirect("/listings");
 
};


// edit listing give form  callback function

module.exports.editListing= async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("Listings/edit.ejs",{listing});
    
};

// update listing callback function
module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id); 
   req.flash("success","listing deleted");
    res.redirect("/listings");
};