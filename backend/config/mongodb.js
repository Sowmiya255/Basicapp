import mongoose from "mongoose";
const connectDB=async() =>{
    mongoose.connection.on('connected',() => {
        console.log("Mongodb connected successfully.....")
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/website`);
};
export default connectDB;