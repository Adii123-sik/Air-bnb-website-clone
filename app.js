if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



const express = require("express");
let app = express();
const mongoose = require("mongoose");
const port = 8080;
// Importing required modules
const path = require("path");
// Middleware for parsing request bodies and method overrides
const methodOverride = require("method-override");
// Middleware for rendering EJS templates
const ejsMate = require("ejs-mate");
// Custom error handling utility
const ExpressError = require("./utils/ExpressError.js");
// Middleware for session management, flash messages, and user authentication
const session=require("express-session");
// MongoDB session store for Express
const MongoStore = require('connect-mongo');
// Middleware for flash messages
const flash=require("connect-flash");
// Passport.js for user authentication
const passport=require("passport");
// Local strategy for Passport.js
const LocalStrategy=require("passport-local");
// Importing the User model
const User=require("./models/user.js");


// Importing routes for listings, reviews, and user management
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");


// Setting up the view engine and static file serving
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);



const dbURL=process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbURL);
}
main()
  .then((result) => {
    console.log("connection succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

//Setting up the MongoDB session store
  
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },  
  touchAfter: 24 * 3600, // time in seconds
});

store.on("error", function (e) {
  console.log("session store error", e);
});

// Session configuration for user authentication
  const sessionOption={
  store: store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};





// Middleware for session management and flash messages
app.use(session(sessionOption));
app.use(flash());

// passport configuration user authentication 

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


// Middleware to make flash messages available in views

app.use((req,res,next)=>{
  res.locals.success=req.flash("success"); 
  res.locals.error=req.flash("error"); 
  res.locals.currentUser=req.user;
  next();
});

// app.get("/demouser",async (req, res) => {
//  let fakeuser=new User({
//    username:"demo-user",
//    email:"demo@example.com",
//  });
//  let registeredUser= await User.register(fakeuser,"helloworld");
//  console.log(registeredUser);
// });
  
//use routes from diffrent file

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
 
//error handling middleware

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;

  res.status(statusCode).render("error.ejs",{message});
});
app.listen(port, () => {
  console.log(`server is listening on a port${port}`);
}); 