class AppError extends Error {
    constructor(errorCode, message, statusCode) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export default AppError; 