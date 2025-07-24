const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Render the signup form & Create new user route

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.creatNewUser));

// Render the login form & Handle user login route
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.loginUserCheck);



// Handle user logout
router.get("/logout", userController.logoutUser);

module.exports = router;



