import config from "./src/config";
import {
  Admin,
  Club,
  Student,
  ClubLocation,
  Notice,
  Teacher,
} from "./src/models";

export = {
  type: "mysql",
  host: config.mysql.dbHost,
  port: Number(config.mysql.dbPort),
  username: config.mysql.dbUser,
  password: config.mysql.dbPass,
  database: config.mysql.dbName,
  synchronize: false,
  logging: false,
  entities: [Admin, Club, Student, ClubLocation, Notice, Teacher],
};
