class ApiError extends Error {
    constructor(message , status) {
        super();
        this.statusCode = this.statusCode;
        this.message = message;
    }
}
module.exports = ApiError;