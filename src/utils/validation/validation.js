import Joi from 'joi';

const registerValidation = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(2).max(30).required().messages({
            "string.empty": "First name is required",
            "string.min": "First name must be at least {#limit} characters long",
            "string.max": "First name must be at most {#limit} characters long",
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format. Please provide a valid email address.",
        }),
        password: Joi.string().min(6).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least {#limit} characters long",
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            "any.only": "Confirm password must match the password",
            "string.empty": "Confirm password is required",
        }),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format. Please provide a valid email address.",
        }),
        password: Joi.string().min(6).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least {#limit} characters long",
        }),
    });

    return schema.validate(data);
};

const EmployeeValidation = (data, isUpdate = false) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(50).required().messages({
            "string.empty": "Full name is required",
            "string.min": "Full name must be at least {#limit} characters long",
            "string.max": "Full name must not exceed {#limit} characters"
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        }),
        phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
            "string.empty": "Phone number is required",
            "string.length": "Phone number must be exactly {#limit} digits",
            "string.pattern.base": "Phone number must contain only digits"
        }),
        position: Joi.string()
            .valid("intern", "fulltime", "junior", "senior", "teamlead")
            .required()
            .messages({
                "string.empty": "Position is required",
                "any.only": "Invalid position. Allowed values: intern, fulltime, junior, senior, teamlead"
            }),
        experience: Joi.number().integer().min(0).required().messages({
            "number.base": "Experience must be a number",
            "number.min": "Experience cannot be negative"
        }),
        resume: isUpdate
            ? Joi.string().optional() // Make it optional for updates
            : Joi.string().required().messages({
                "string.empty": "Resume file path is required"
            }),
        declaration: Joi.boolean().valid(true).required().messages({
            "any.only": "You must agree to the declaration"
        }),
        status: Joi.string()
            .valid("new", "scheduled", "ongoing", "selected", "rejected")
            .default("new")
            .messages({
                "any.only": "Invalid status value. Allowed values: new, scheduled, ongoing, selected, rejected"
            }),
        joiningDate: Joi.date()
            .optional()
            .messages({
                "date.base": "Joining date must be a valid date"
            }),
        department: Joi.string()
            .optional()
            .max(100)
            .messages({
                "string.max": "Department name must not exceed {#limit} characters"
            })
    });

    return schema.validate(data);
};
export default { registerValidation, loginValidation, EmployeeValidation };
