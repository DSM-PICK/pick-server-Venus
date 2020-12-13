import app from "./app";
import config from "./config";
import logger from "./loaders/logger";

app.listen(config.port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
    return;
  }
  logger.debug(`Server listening on ${config.port}`);
});
