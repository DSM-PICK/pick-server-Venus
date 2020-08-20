import { createConnection } from "typeorm";
import logger from "./logger";

export default async () => {
  try {
    await createConnection();
  } catch (e) {
    logger.error(`mysql connection error : ${e}`);
    process.exit(1);
    return;
  }
};
