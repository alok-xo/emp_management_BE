import multer from "multer";
import path from "path";
import fs from "fs";

// Define the storage path
const uploadDir = path.join("uploads", "resumes");

// Ensure the directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        cb(null, uniqueSuffix);
    }
});

// Allowed file types for resumes
const allowedMimeTypes = [
    "application/pdf",    // PDF
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "image/png",          // PNG
    "image/jpeg"          // JPEG
];

// File filter for resumes
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("❌ Only PDF, DOC, DOCX, JPG, and PNG files are allowed!"), false);
    }
};

// Initialize Multer middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export the middleware
export default upload;
