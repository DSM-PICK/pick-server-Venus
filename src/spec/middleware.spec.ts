import * as jwt from "jsonwebtoken";
import { expect } from "chai";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import verify from "../api/middlewares/tokenVerification/verify";
import { invalidTokenError, notAccessTokenError } from "../errors";

describe("Middlewares", () => {
  describe("verify token", () => {
    const jwtSecret = "venus_test";

    it("should return information", () => {
      const validToken =
        "Bearer " +
        jwt.sign({ type: "access", id: "admin" }, jwtSecret, {
          expiresIn: "3m",
        });
      const payload: any = verify({ token: validToken, jwtSecret });
      delete payload.iat;
      delete payload.exp;
      expect(payload).to.deep.equal({ type: "access", id: "admin" });
    });

    it("should throw expired token error", () => {
      const expiredToken =
        "Bearer " +
        jwt.sign({ type: "access", id: "admin" }, jwtSecret, {
          expiresIn: 0,
        });
      expect(function () {
        verify({ token: expiredToken, jwtSecret });
      }).to.throw(TokenExpiredError);
    });

    it("should throw invalid token error", () => {
      const invalidToken = "Bearer invalidToken";
      expect(function () {
        verify({ token: invalidToken, jwtSecret });
      }).to.throw(JsonWebTokenError);
    });

    it("should throw not access token error", () => {
      const refreshToken =
        "Bearer " +
        jwt.sign({ type: "refresh" }, jwtSecret, {
          expiresIn: "3m",
        });
      expect(function () {
        verify({ token: refreshToken, jwtSecret });
      }).to.throw(notAccessTokenError);
    });

    it("should throw invalid token error", () => {
      expect(function () {
        verify({ token: null, jwtSecret });
      }).to.throw(invalidTokenError);
    });

    it("should throw invalid token error with not bearer", () => {
      expect(function () {
        verify({ token: "not bearer token", jwtSecret });
      }).to.throw(invalidTokenError);
    });
  });
});
