import { Router } from "express";
import auth from "./routes/auth";
import club from "./routes/club";
import logger from "../loaders/logger";

export default () => {
  const app = Router();

  app.get("/check", (req, res) => {
    res.status(200).end();
  });
  app.get("/status", (req, res) => {
    logger.debug("health check");
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    logger.debug("health check");
    res.status(200).end();
  });

  auth(app);
  club(app);

  return app;
};
