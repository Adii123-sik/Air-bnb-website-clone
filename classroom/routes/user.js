const express=require("express");

const router=express.Router();

//users route

// index users

router.get("/",(req,res)=>{
    res.send("GET for users");
});

// show users route
router.get("/:id",(req,res)=>{
    res.send("GET for user id");
});

// post route for create new users

router.post("/",(req,res)=>{
    res.send("Post for users");
});

// delete route for users
router.post("/:id",(req,res)=>{
    res.send("DELETE for users");
});


module.exports=router;