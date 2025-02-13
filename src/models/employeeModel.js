import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
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
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        enum: ["intern", "fulltime", "junior", "senior", "teamlead"],
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    declaration: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        enum: ["new", "scheduled", "ongoing", "selected", "rejected"],
        default: "new"
    },
    joiningDate: {
        type: Date,
        required: false
    },
    department: {
        type: String,
        trim: true,
        required: false
    },
    attendanceStatus: {
        type: String,
        enum: ["present", "absent", "leave"],
        default: "present"
    }
}, {
    collection: "Employees",
    timestamps: true
});

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
