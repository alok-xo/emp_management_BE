import { StatusCodes } from "http-status-codes";
import Leave from "../models/leavesModel.js";
import Logger from "../utils/logger/logger.js";
import AppError from "../utils/error/error.js";

export const addLeaveRequest = async (req, res) => {
    try {
        const { employeeName, designation, leaveDate, document, reason } = req.body;

        // Validate required fields
        if (!employeeName || !designation || !leaveDate || !reason) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Employee name, designation, leave date, and reason are required",
                success: false
            });
        }

        // Parse and validate leave date
        const parsedLeaveDate = new Date(leaveDate);
        if (isNaN(parsedLeaveDate.getTime())) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid leave date format",
                success: false
            });
        }

        // Create a new leave request
        const newLeave = new Leave({
            employeeName,
            designation,
            leaveDate: parsedLeaveDate,
            document: document || null, // Optional
            reason
        });

        await newLeave.save();

        res.status(StatusCodes.CREATED).json({
            message: "Leave request added successfully",
            success: true,
            data: newLeave
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";

        if (err instanceof AppError) {
            statusCode = err.statusCode;
            message = err.message;
        }

        return res.status(statusCode).json({
            message,
            success: false,
            code: statusCode
        });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params; // Leave ID from URL
        const { status } = req.body; // New status (approve/reject)

        // Validate required fields
        if (!status) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Status is required",
                success: false
            });
        }

        // Allowed status values
        const allowedStatuses = ["approved", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
                success: false
            });
        }

        // Find the leave request by ID
        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Leave request not found",
                success: false
            });
        }

        // Update leave status
        leave.status = status;
        await leave.save();

        res.status(StatusCodes.OK).json({
            message: `Leave request ${status} successfully`,
            success: true,
            data: leave
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";

        if (err instanceof AppError) {
            statusCode = err.statusCode;
            message = err.message;
        }

        return res.status(statusCode).json({
            message,
            success: false,
            code: statusCode
        });
    }
};

export const getEmployeesOnLeave = async (req, res) => {
    try {
        // Fetch employees whose leave status is 'approved'
        const employeesOnLeave = await Leave.find({ status: "approved" });

        // Count the number of employees on leave
        const leaveCount = employeesOnLeave.length;

        res.status(StatusCodes.OK).json({
            message: "Employees currently on leave",
            success: true,
            count: leaveCount,
            data: employeesOnLeave
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";

        if (err instanceof AppError) {
            statusCode = err.statusCode;
            message = err.message;
        }

        return res.status(statusCode).json({
            message,
            success: false,
            code: statusCode
        });
    }
};

export const searchLeaves = async (req, res) => {
    try {
        const { employeeName, status } = req.query;

        // Create a filter object
        let filter = {};

        // If employeeName is provided, add case-insensitive search
        if (employeeName) {
            filter.employeeName = { $regex: employeeName, $options: "i" };
        }

        // If status is provided, validate and add to filter
        if (status) {
            const allowedStatuses = ["pending", "approved", "rejected"];
            if (!allowedStatuses.includes(status)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
                    success: false
                });
            }
            filter.status = status;
        }

        // Fetch leave requests based on filters
        const leaves = await Leave.find(filter);

        res.status(StatusCodes.OK).json({
            message: "Leave requests fetched successfully",
            success: true,
            count: leaves.length,
            data: leaves
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";

        if (err instanceof AppError) {
            statusCode = err.statusCode;
            message = err.message;
        }

        return res.status(statusCode).json({
            message,
            success: false,
            code: statusCode
        });
    }
};