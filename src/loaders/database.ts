import { createConnection, useContainer } from "typeorm";
import { Container } from "typedi";
import logger from "./logger";

export default async () => {
  try {
    useContainer(Container);
    await createConnection();
  } catch (e) {
    logger.error(`database connection error : ${e}`);
    process.exit(1);
    return;
  }
};
