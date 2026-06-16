import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectToDatabase = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL!);
        console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export  {connectToDatabase};