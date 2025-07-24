const express=require("express");

const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIN, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js"); 
const multer = require("multer");
const { cloudinary, storage } = require("../cloudconfig.js");
const upload = multer({ storage: storage }); // Configure multer to use Cloudinary storage

// Index route & Create route
// Fetch all listings and render the index page, or create a new listing
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIN,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

// Render the form to create a new listing
router.get("/new", isLoggedIN, listingController.renderNewForm);


// Show route & Update route & Delete route
// Fetch a specific listing by ID, update it, or delete it

router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIN, isOwner, validateListing, wrapAsync( listingController.updateListing))
.delete(isLoggedIN, isOwner, wrapAsync(listingController.deleteListing));


//edit route
// Fetch a specific listing by ID and render the edit form
router.get("/:id/edit",isLoggedIN,isOwner, wrapAsync(listingController.editListing));


module.exports=router;
