
// utils/ExpressError.js
// Custom error class for handling errors in Express applications
class ExpressError extends Error{
    constructor(statusCode,message  ){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}

module.exports=ExpressError;