const User = require("../models/user.js");


// Render the signup form callback function
module.exports.renderSignupForm =(req, res) => {
    res.render("users/signup.ejs");

};


//create new user callback function
module.exports.creatNewUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        if (!registeredUser) {
            req.flash("error", "Registration failed");
            return res.redirect("/signup");
        }
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "Something went wrong");
                return res.redirect("/signup");
            }
            req.flash("success", "user registered successfully");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }


};

// Render the login form callback function
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// Handle user login callback function
module.exports.loginUserCheck =  async (req, res) => {
    req.flash("success", "welcome to wanderlust you are logged in!");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

// Handle user logout callback function

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
};