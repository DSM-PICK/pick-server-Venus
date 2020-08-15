import config from "./src/config";

export = {
  type: "mysql",
  host: config.dbHost,
  port: Number(config.dbPort),
  username: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  synchronize: false,
  logging: false,
  entities: ["./src/models/**/*.ts"],
};
