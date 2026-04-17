import mongoose from "mongoose"
export const ConnectMongoose=()=>{
  mongoose.connect(process.env.DB_URI).then((data)=>{console.log(data.connection.host)})
}
