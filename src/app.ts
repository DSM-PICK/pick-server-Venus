import "reflect-metadata";
import * as express from "express";

import init from "./loaders";
import config from "./config";
import logger from "./loaders/logger";

async function startServer() {
  const app = express();

  await init(app);

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.debug(`Server listening on ${config.port}`);
  });
}

startServer();
