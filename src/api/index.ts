import { Router } from "express";
import { auth, club, clubs, locations, students } from "./routes";
import logger from "../loaders/logger";
import teachers from "./routes/teachers";

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
  teachers(app);

  return app;
};
