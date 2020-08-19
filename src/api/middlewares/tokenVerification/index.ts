import { Request, Response, NextFunction } from "express";

import verify from "./verify";
import config from "../../../config";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.get("Authorization");
  try {
    res.locals.payload = verify({ token, jwtSecret: config.jwtSecret });
    next();
  } catch (e) {
    next(e);
  }
};
