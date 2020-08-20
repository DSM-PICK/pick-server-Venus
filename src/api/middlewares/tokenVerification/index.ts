import { Request, Response, NextFunction } from "express";

import verify from "./verify";
import config from "../../../config";
import {
  expiredTokenError,
  invalidTokenError,
  notAccessTokenError,
} from "../../../errors";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.get("Authorization");
  try {
    res.locals.payload = verify({
      token,
      jwtSecret: config.jwtSecret,
    });
    next();
  } catch (e) {
    if (e === TokenExpiredError) {
      return next(expiredTokenError);
    } else if (e === notAccessTokenError) {
      return next(e);
    }
    next(invalidTokenError);
  }
};
