import * as jwt from "jsonwebtoken";

import { invalidTokenError, notAccessTokenError } from "../../../errors";

export default ({ token, jwtSecret }: { token: string; jwtSecret: string }) => {
  if (!token || typeof token !== "string") {
    throw invalidTokenError;
  }
  const splitToken = token.split(" ");
  if (splitToken[0] !== "Bearer") {
    throw invalidTokenError;
  }
  const payload: any = jwt.verify(splitToken[1], jwtSecret);
  if (payload.type !== "access") {
    throw notAccessTokenError;
  }
  return payload;
};
