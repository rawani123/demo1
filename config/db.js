import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // console.log(process.env.MONGO_URI)/
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
       console.log("Error in connecting database",error.message); 
    }
}

export default connectDB;