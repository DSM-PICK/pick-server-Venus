import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import * as moment from "moment-timezone";

import route from "../api";
import { apiNotFoundError } from "../errors";
import { errorStream, infoStream } from "./logger";

morgan.token("date", (req, res) => {
  return moment().tz("Asia/Seoul").format();
});

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    morgan("combined", {
      stream: errorStream,
      skip: (req, res) => res.statusCode < 500,
    })
  );
  app.use(
    morgan("combined", {
      stream: infoStream,
      skip: (req, res) => res.statusCode >= 500,
    })
  );

  app.use("/venus", route());

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
