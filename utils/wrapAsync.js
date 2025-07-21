// utils/wrapAsync.js
// Utility function to wrap asynchronous route handlers in Express
module.exports=(fn)=>{
  return (req,res,next)=>{
   fn(req,res,next).catch(next)
  }
}
