//middleware function always take 4 inputs - err, req, res, next

const errorMiddleware = (err, req, res, next) => {
  console.error("Error caught:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose: Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose: Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose: Validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};


export default errorMiddleware;
