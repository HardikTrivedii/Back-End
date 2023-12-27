// logger.js
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Log MySQL error
const logMySqlError = (message: any, error: any) => {
  if (
    error.name === "SequelizeDatabaseError" ||
    error.name === "SequelizeValidationError"
  ) {
    logger.error(`MySQL Error: ${message}`, { error });
    // Additional handling for storing in a separate MySQL error log file
    logger.error(`MySQL Error: ${message}`, {
      error,
      filename: "mysql_error.log",
    });
  }
};

// Log an info message
const logInfo = (message: any) => {
  logger.info(message);
};

export { logMySqlError, logInfo };
