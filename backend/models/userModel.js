import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter full name field"],
        minLength:[3,"Minimum more than 3 characters required"],
        maxLength:[25,"Maximum length of characters is 25"]
    },
    email:{
        type:String,
        unique:true,
        validate:[validator.isEmail,"Enter the email"],
        required:[true,"Please enter the email"],
        minLength:[3,"Minimum more than 3 characters required"],
        maxLength:[25,"Maximum length of characters is 25"]
    },
    password:{
        type:String,
        required:[true,"Please enter the password"],
        minLength:[3,"Minimum more than 3 characters required"],
        select:false,
        
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{timestamps:true})

 userSchema.pre("save",async function(){
     if(!this.isModified("password")){
         return ;
     }
     this.password = await bcrypt.hash(this.password,10);
 })

 userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWTEXPIRE})
 }

 userSchema.methods.verifyPassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
 }

userSchema.methods.getPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 30*60*1000;
    return resetToken;
};

export default mongoose.model("User",userSchema);