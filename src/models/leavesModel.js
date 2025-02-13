import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    leaveDate: {
        type: Date,
        required: true
    },
    document: {
        type: String, // File path or URL
        required: false // Optional
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    collection: "Leaves",
    timestamps: true
});

const Leave = mongoose.model("Leave", LeaveSchema);
export default Leave;
