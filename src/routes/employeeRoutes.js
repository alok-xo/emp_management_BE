import express from "express";
import { createEmployee, deleteEmployee, getAllEmployees, updateEmployee, updateEmployeeAttendanceById, updateEmployeeStatus } from "../controller/employeeController.js";
import upload from "../utils/middleware/upload.js";
import { protect } from "../utils/middleware/auth.js";

const router = express.Router();

router.post("/submit", protect, upload.single("resume"), createEmployee);
router.put("/update_status", protect, updateEmployeeStatus);
router.put("/update_employee", upload.single("resume"), updateEmployee);
router.delete("/delete_employee/:id", deleteEmployee);
router.get("/employees", protect, getAllEmployees);
router.put("/updateAttendance/:id", updateEmployeeAttendanceById);

export default router;
