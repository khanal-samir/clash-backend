class ApiError extends Error {
  // add new attributes to error class
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number, // required
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); //proper inheritance of base error class
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
