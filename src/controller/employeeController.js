import Employee from "../models/employeeModel.js";
import { StatusCodes } from "http-status-codes";
import validation from "../utils/validation/validation.js";
import Logger from '../utils/logger/logger.js';
import AppError from '../utils/error/error.js';

export const createEmployee = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, position, experience, declaration, status } = req.body;

        // Check for file first
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Resume file is required",
                success: false
            });
        }

        // Add resume path to req.body for validation
        req.body.resume = req.file.path;

        // Validate data
        const { error } = validation.EmployeeValidation(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.details[0].message,
                success: false
            });
        }

        // Check for existing Employee with the same email
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "An Employee with this email already exists.",
                success: false
            });
        }

        const resumePath = req.file.path;

        // Validate status field (optional)
        const allowedStatuses = ["new", "scheduled", "ongoing", "selected", "rejected"];
        const validatedStatus = status && allowedStatuses.includes(status) ? status : "new";

        const employee = new Employee({
            fullName,
            email,
            phoneNumber,
            position,
            experience,
            resume: resumePath,
            declaration,
            status: validatedStatus
        });

        await employee.save();

        res.status(StatusCodes.CREATED).json({
            message: "Employee created successfully",
            success: true,
            data: employee
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = 500;
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

export const updateEmployeeStatus = async (req, res) => {
    try {
        const { email, status, position, joiningDate, department } = req.body;

        // Validate input
        if (!email || !status) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email and status are required",
                success: false
            });
        }

        // Allowed status values
        const allowedStatuses = ["new", "scheduled", "ongoing", "selected", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
                success: false
            });
        }

        // Allowed position values
        const allowedPositions = ["intern", "fulltime", "junior", "senior", "teamlead"];
        if (position && !allowedPositions.includes(position)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Invalid position. Allowed values: ${allowedPositions.join(", ")}`,
                success: false
            });
        }

        // Find the Employee by email
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Employee not found",
                success: false
            });
        }

        // Update the status
        employee.status = status;

        // Update position if provided
        if (position) employee.position = position;

        // Update department if provided
        if (department) employee.department = department;

        // Update joining date if provided
        if (joiningDate) {
            const parsedDate = new Date(joiningDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid joining date format",
                    success: false
                });
            }
            employee.joiningDate = parsedDate;
        }

        await employee.save();

        res.status(StatusCodes.OK).json({
            message: "Employee status updated successfully",
            success: true,
            data: employee
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = 500;
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

export const updateEmployee = async (req, res) => {
    try {
        const { email, fullName, phoneNumber, position, experience, declaration, status, department } = req.body;

        // Validate input
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email is required",
                success: false
            });
        }

        // Find the Employee by email (fixed variable naming)
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Employee not found",
                success: false
            });
        }

        // Update fields if provided (fixed variable references)
        if (fullName) employee.fullName = fullName;
        if (phoneNumber) employee.phoneNumber = phoneNumber;
        if (position) employee.position = position;
        if (experience) employee.experience = experience;
        if (declaration !== undefined) employee.declaration = declaration;
        if (department) employee.department = department;

        // Validate and update status
        const allowedStatuses = ["new", "scheduled", "ongoing", "selected", "rejected"];
        if (status && allowedStatuses.includes(status)) {
            employee.status = status;
        } else if (status) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
                success: false
            });
        }

        // Handle resume update
        if (req.file) {
            employee.resume = req.file.path;
        }

        await employee.save();

        res.status(StatusCodes.OK).json({
            message: "Employee updated successfully",
            success: true,
            data: employee
        });

    } catch (err) {
        Logger.error(err.message);
        let statusCode = 500;
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

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from URL params

        // Validate input
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Employee ID is required",
                success: false
            });
        }

        // Find and delete the Employee by ID
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Employee not found",
                success: false
            });
        }

        res.status(StatusCodes.OK).json({
            message: "Employee deleted successfully",
            success: true
        });

    } catch (err) {
        console.error(err); // Ensure you log the full error for debugging
        let statusCode = 500;
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

export const getAllEmployees = async (req, res) => {
    try {
        let { page = 1, limit = 10, position, status, search } = req.query;

        // Convert `page` and `limit` to numbers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        // Ensure page and limit are valid
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        // Build the query object dynamically
        let filter = {};

        if (position) filter.position = position; // Exact match for position
        if (status) filter.status = status; // Exact match for status
        if (search) {
            filter.fullName = { $regex: search, $options: "i" }; // Case-insensitive partial match
        }

        // Fetch paginated and filtered employees
        const employees = await Employee.find(filter)
            .skip(skip)
            .limit(limit);

        // Get total filtered employee count
        const totalEmployees = await Employee.countDocuments(filter);

        res.status(StatusCodes.OK).json({
            success: true,
            count: employees.length,
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: page,
            employees
        });
    } catch (err) {
        console.error(err); // Log error for debugging
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

export const updateEmployeeAttendanceById = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL parameter
        const { attendanceStatus } = req.body;

        // Validate input
        if (!attendanceStatus) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Attendance status is required",
                success: false
            });
        }

        // Allowed attendance status values
        const allowedAttendanceStatuses = ["present", "absent", "leave"];
        if (!allowedAttendanceStatuses.includes(attendanceStatus)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Invalid attendance status. Allowed values: ${allowedAttendanceStatuses.join(", ")}`,
                success: false
            });
        }

        // Find the employee by ID
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Employee not found",
                success: false
            });
        }

        // Update the attendance status
        employee.attendanceStatus = attendanceStatus;

        await employee.save();

        res.status(StatusCodes.OK).json({
            message: "Employee attendance status updated successfully",
            success: true,
            data: employee
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

export const getPresentEmployees = async (req, res) => {
    try {
        // Fetch employees with attendanceStatus of "present"
        const employees = await Employee.find({ attendanceStatus: "present" });

        res.status(StatusCodes.OK).json({
            success: true,
            count: employees.length,
            employees
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