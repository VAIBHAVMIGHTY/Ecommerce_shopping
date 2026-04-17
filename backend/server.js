import app from './app.js'
import dotenv from 'dotenv'
import { ConnectMongoose } from './config/db.js'
dotenv.config({path:"backend/config/config.env"})
import {v2 as cloudinary} from 'cloudinary';
import Razorpay from 'razorpay';

ConnectMongoose();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const port = process.env.PORT || 3000;

export const instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
})


const server = app.listen(port,()=>{console.log(`PORT IS RUNNING IN ${port}`)})
process.on('uncaughtException',(err)=>{
    console.log(`Error ${err}`);
    server.close(()=>process.exit(1))
})
process.on('unhandledRejection',(err)=>{
    console.log(err.message);
    server.close(()=>process.exit(1));
})
