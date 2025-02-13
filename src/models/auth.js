import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
},
    {
        collection: "authSchema", //col name
        versionKey: false,
        timestamp: true
    }
);

const auth = mongoose.model("authSchema", authSchema);
export default auth;