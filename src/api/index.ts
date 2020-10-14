import { Router } from "express";
import { auth, clubs, club, locations, students } from "./routes";
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
  clubs(app);
  club(app);
  locations(app);
  students(app);

  return app;
};
