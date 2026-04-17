import handleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error";
    if(err.name === "CastError"){
        const message=`Invalid path error ${err.path}`;
        err=new handleError(message,404)
    }
    if(err.code===11000){
        const message= `this ${Object.keys(err.keyValue)} already exists.Kindly login again`;
        err=new handleError(message,404)
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}