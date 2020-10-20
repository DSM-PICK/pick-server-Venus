import * as winston from "winston";

const consoleTransport = new winston.transports.Console({
  format: winston.format.printf(
    (info) => `[${info.level.toUpperCase()}] - ${info.message}`
  ),
  level: "debug",
});

const fileTransport = new winston.transports.File({
  filename: "venus.log",
  zippedArchive: false,
  format: winston.format.printf(
    (info) => `[${info.level.toUpperCase()}] - ${info.message}`
  ),
  dirname: "./logs",
  level: "info",
});

winston.add(consoleTransport);
if (process.env.NODE_ENV !== "test") {
  winston.add(fileTransport);
}

export const errorStream = {
  write: (message) => winston.error(message.trim()),
};

export const infoStream = {
  write: (message) => winston.info(message.trim()),
};

export default winston;
