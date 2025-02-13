import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.info("Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        console.info("mongoDB connected")
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;