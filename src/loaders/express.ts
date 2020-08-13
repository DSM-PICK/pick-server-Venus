import * as express from "express";
import * as cors from "cors";
import route from "../api";
import { apiNotFoundError } from "../errors";

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/admin", route());

  app.use((req, res, next) => {
    next(apiNotFoundError);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      status: err.status,
    });
  });
};
