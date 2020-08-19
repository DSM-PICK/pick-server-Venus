import * as jwt from "jsonwebtoken";

import { expiredOrInvalidTokenError } from "../../../errors";

export default ({ token, jwtSecret }: { token: string; jwtSecret: string }) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    throw expiredOrInvalidTokenError;
  }
};
