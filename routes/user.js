const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// Render the signup form
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");

});

// Handle user registration
// Create a new user and redirect to the listings page
router.post("/signup", wrapAsync(async (req,res)=>{
    try {
        const {username, email, password}=req.body;
        let newUser=new User({username, email});
        let registeredUser=await User.register(newUser, password);
       console.log(registeredUser);
       req.flash("success","user registered successfully");
       res.redirect("/listings");
    }catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    

}));


// Render the login form
// Display the login page for users to enter their credentials
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

// Handle user login
// Authenticate the user and redirect to the listings page on success
router.post("/login",passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),async (req,res)=>{
   req.flash("success","welcome to wanderlust you are logged in!");
   res.redirect("/listings");
});
module.exports=router;

  
 