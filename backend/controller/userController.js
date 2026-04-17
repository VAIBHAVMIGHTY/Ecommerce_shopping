import express from "express";
import User from "../models/userModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';
import {v2 as cloudinary} from 'cloudinary';

export const register = handleAsyncError(async(req,res,next)=>{
    const {name,email,password,avatar} = req.body;
    const myCloud=await cloudinary.uploader.upload(avatar,{
        folder:'avatars',
        width:150,
        crop:'scale'
    })
    const user = await User.create({name,email,password,avatar:{public_id:myCloud.public_id,url:myCloud.secure_url}});
    const token =user.getJWTToken();
    sendToken(user,200,res);
})
export const login = handleAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new handleError("The email or password field cannot be empty",401));
    }
    const user = await User.findOne({email}).select("+password");
    const isPassword = await user.verifyPassword(password)

    if(!isPassword){
        return next(new handleError("Password field is incorrect",401));
    }
    
    if(!user){
        return next(new handleError("email field is incorrext",401));
    }
    else{
          sendToken(user,200,res);
    }
})
export const logout = handleAsyncError(async(req,res,next)=>{
    res.cookie('token',null,{expires:new Date(Date.now()),httpOnly:true});
    res.status(201).json({
        success:true,
        message:"Successfully Logged out"
    })
})
export const forgotPasswordToken = handleAsyncError(async(req,res,next)=>{
    const {email}=req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new handleError("Email id does not exists",400));
    }
    let resetToken;
    try {
        resetToken = user.getPasswordResetToken();
        await user.save({validateBeforeSave:false});
        console.log(resetToken);
    } catch (error) {
        console.log(error);
        return next(new handleError("Internal server",500))
    }
    let resetTokenUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    //console.log(resetTokenUrl);
    const message=`This is the reset link ${resetTokenUrl}, If you have used ignored it and it will expire in 30 minutes.`;
    try{
    await sendEmail({email:user.email,subject:"This is the email to reset Password",message});
    res.status(200).json({
   success:true,
   message:"Email sent successfully",
    user
    })
    }catch(err){
         user.resetPasswordToken=undefined,
         user.resetPasswordExpire=undefined
         await user.save({validateBeforeSave:true});
         return next(new handleError("Internal error while sending resetTokenUrl",500));

    }
})
export const resetPasswordToken = handleAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(resetPasswordToken)
    const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});
    if(!user){return next(new handleError("Reset Token expired or invalid",400))};
    const {password,confirmPassword}=req.body;
    if(password !== confirmPassword){
        return next(new handleError("Password and Confirm Password does not match",400));
    }
    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);
})
export const getUserDetails = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(201).json({
        success:true,
        message:"Profile Details",
        user
    })

})
export const updatePassword = handleAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body;
    const user = await User.findById(req.user.id).select("+password");
    const CorrectPassword = await user.verifyPassword(oldPassword);
    if(!CorrectPassword){
        return next(new handleError("Old password entered is incorrect",401))
    }
    if(newPassword!==confirmPassword){
        return next(new handleError("New  and confirm password does not match",401));
    }
    user.password=newPassword;
    await user.save();
    sendToken(user,200,res);

})
export const updateProfile = handleAsyncError(async(req,res,next)=>{
    const {name,email,avatar}=req.body;
    const updatedInfo={name,email};
    if(avatar!==""){
        const user=await User.findById(req.user.id);
        const imageId=user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);
        const mycloud=await cloudinary.uploader.upload(avatar,{
        folder:'avatars',
        width:150,
        crop:'scale'
    })
        updatedInfo.avatar={
            public_id:mycloud.public_id,
            url:mycloud.secure_url

        }
    }
    const user = await User.findByIdAndUpdate(req.user.id,updatedInfo,{new:true,runValidators:true});
    res.status(200).json({
        success:true,
        user,
        message:"Data updated successfully"
    })
})
export const getUserList = handleAsyncError(async(req,res,next)=>{
    const user = await User.find();
    res.status(200).json({
        success:true,
        user
    })
})
export const getSingleUserList = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new handleError("User does not exist with this id",401))
    }
    res.status(200).json({
        success:true,
        user
    })
})
export const updateUserRole = handleAsyncError(async(req,res,next)=>{
    const {role} = req.body;
    const updateRole = {role};
    const user = await User.findByIdAndUpdate(req.params.id,updateRole,{new:true,runValidators:true});
    if(!user){
        return next(new handleError("User not found or he do not have the access",401))
    }
    res.status(200).json({
        success:true,
        user
    })
})
export const deleteUser = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new handleError("User doesn't exist",400))
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})