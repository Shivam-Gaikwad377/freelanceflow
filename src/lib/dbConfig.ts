import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectToDatabase() {
    try{
        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });
        connection.on("error", (error) => {
            console.error("Error connecting to database:", error);
            process.exit();
        });
    }catch(error){
        console.error("Error connecting to database:", error);
    }
}