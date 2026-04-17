import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv'
import payment from './routes/paymentRoutes.js';
import cors from 'cors';


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use("/api/v1",productRoutes)
app.use("/api/v1",userRoutes)
app.use("/api/v1",orderRoutes)
app.use("/api/v1",payment)
app.use(errorHandleMiddleware)
dotenv.config({path:'backend/config/config.env'})
export default app;