import express from "express";
import { addLeaveRequest, getEmployeesByName, getEmployeesOnLeave, getFilteredLeaves, searchLeaves, updateLeaveStatus } from "../controller/leavesController.js";
import { protect } from "../utils/middleware/auth.js";
import upload from "../utils/middleware/upload.js";

const router = express.Router();

router.post("/addLeaveRequest", upload.single("document"), protect, addLeaveRequest);
router.put("/update_status/:id", protect, updateLeaveStatus);
router.get("/employees_on_leave", protect, getEmployeesOnLeave); //calender api
router.get("/fiter_leaves", protect, searchLeaves);
router.get("/getFilteredLeaves", getFilteredLeaves);
router.get("/getEmployeesByName",protect, getEmployeesByName);

export default router;