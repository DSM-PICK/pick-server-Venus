import * as winston from "winston";
import "winston-daily-rotate-file";
import * as moment from "moment";

const transports = [];
const tsFormat = moment().format("YYYY-MM-DD HH:mm:ss");

const baseOptions = {
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "50m",
  maxFiles: "14d",
  format: winston.format.printf(
    (info) => `${tsFormat} [${info.level.toUpperCase()}] - ${info.message}`
  ),
};

transports.push(
  new winston.transports.DailyRotateFile(
    Object.assign(
      {
        filename: "application-%DATE%.log",
        level: "info",
        dirname: "./logs/app",
      },
      baseOptions
    )
  ),
  new winston.transports.DailyRotateFile(
    Object.assign(
      {
        filename: "error-%DATE%.log",
        level: "error",
        dirname: "./logs/error",
      },
      baseOptions
    )
  ),
  new winston.transports.Console({
    format: winston.format.printf(
      (info) => `[${info.level.toUpperCase()}] - ${info.message}`
    ),
    level: "debug",
  })
);

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports,
});

export default logger;
