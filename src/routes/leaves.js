import express from "express";
import { addLeaveRequest, getEmployeesOnLeave, searchLeaves, updateLeaveStatus } from "../controller/leavesController.js";
import { protect } from "../utils/middleware/auth.js";

const router = express.Router();

router.post("/addLeaveRequest", protect, addLeaveRequest);
router.put("/update_status/:id", protect, updateLeaveStatus);
router.get("/employees_on_leave", protect, getEmployeesOnLeave); //calender api
router.get("/fiter_leaves", protect, searchLeaves);

export default router;
