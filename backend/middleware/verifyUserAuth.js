import User from "../models/userModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async(req,res,next)=>{
const {token} = req.cookies;
console.log(token)
if(!token){
    return next(new handleError("Authentication required",401))
}
const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
console.log(decodedToken);
req.user = await User.findById(decodedToken.id);
next();
})

export const roleBasedAccess = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new handleError("Role Access required",403))
        }
        next();
    }
    
}