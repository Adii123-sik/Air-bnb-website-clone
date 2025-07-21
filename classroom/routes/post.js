const express=require("express");

const router=express.Router(); 

//posts route

// index posts

router.get("/",(req,res)=>{
    res.send("GET for posts");
});

// show posts route
router.get("/:id",(req,res)=>{
    res.send("GET for post id");
});

// post route for create new post

router.post("/",(req,res)=>{
    res.send("Post for posts");
});

// delete route for post
router.post("/:id",(req,res)=>{
    res.send("DELETE for posts");
});


module.exports=router;