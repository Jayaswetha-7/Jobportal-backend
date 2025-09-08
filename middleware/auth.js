const errorResponse = require("../utilis/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


//check if user is authenticated
exports.isAuthenticated = async (req, res, next) =>{
    const { token }= req.cookies;
    
    //make sure token exists
    if(!token) {
        return next (new errorResponse('you are not authorized to visit this page', 401));
    }
    try {
        //verity token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id);
        next();
        
    } catch (error) {
        return next(new errorResponse("you are not authorized to visit this page", 401));
        
    }
}

//middleware fr admin
exports.isAdmin =  (req, res, next) =>{
   if (req.user.role ===0) {
    return next(new errorResponse("Only admin can access this page", 401));
   }
   next();
}