const express = require("express");
let app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// connect mongo
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then((result) => {
    console.log("connection succesfull");
  })
  .catch((err) => {
    console.log(err);
  });


  const sessionOption={
  
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};

// home route

app.get("/", (req, res) => {
  res.send("root request is working");
});


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res,next)=>{
  res.locals.success=req.flash("success"); 
  res.locals.error=req.flash("error"); 
  next();
})




//use routes from diffrent file

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//error handling middleware

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;

  res.status(statusCode).render("error.ejs",{message});
});
app.listen(port, () => {
  console.log(`server is listening on a port${port}`);
});