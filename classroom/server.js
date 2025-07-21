const express=require("express");
let app=express();
const port=3000;
 const users=require("./routes/user.js");
 const posts=require("./routes/post.js");
 const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


const { name } = require("ejs");
const sessionOption={

    secret:"mysupersecretstring",
   resave:false,
   saveUninitialized:true
   
}
app.use(session(sessionOption));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
   res.locals.errorMsg=req.flash("error");
   next();
})


app.get("/register",(req,res)=>{
   let {name="gaurav"}=req.query;

   req.session.name=name;
 
   if(name==="gaurav"){
      req.flash("error","user not registered");
   }else{
         req.flash("success","user registerd successfully");
   }
   

  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
  
  
   res.render("page.ejs",{name:req.session.name});
})



// app.get("/reqcount",(req,res)=>{

//    if(req.session.count){
//         req.session.count++;
//    }else{

//       req.session.count=1;
//    }
  
//    res.send(`you sent a request ${req.session.count} times`)
// })

// app.get("/test",(req,res)=>{
//    res.send("test succesfull");
// });
//  app.use(cookieParser("secretcode"));   

//  app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("madin","india",{signed:true});
//     res.send("signed cookie send");
//  });

//  app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
//  })




//  app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("madein","india");
//     res.send("send you some cookies");
//  });

//  app.get("/greet",(req,res)=>{
//     let {name="gaurav"}=req.cookies;
//     res.send(`hii ,${name}`);

//  })

   

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send(" hii i am root");
// });

// app.use("/users",users);
// app.use("/posts",posts);




app.listen(port,()=>{
    console.log(`server is listening on a port ${port}`);
});


    