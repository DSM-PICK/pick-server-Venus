import * as jwt from "jsonwebtoken";
import { expect } from "chai";

import verify from "../api/middlewares/tokenVerification/verify";
import { expiredOrInvalidTokenError, invalidParameterError } from "../errors";
import { loginSchema } from "../api/middlewares/paramValidation/schema";
import validate from "../api/middlewares/paramValidation";

describe("Middlewares", () => {
  describe("verify token", () => {
    const jwtSecret = "venus_test";

    it("should return information", () => {
      const validToken = jwt.sign({ type: "test" }, jwtSecret, {
        expiresIn: "3m",
      });
      const payload: any = verify({ token: validToken, jwtSecret });
      delete payload.iat;
      delete payload.exp;
      expect(payload).to.deep.equal({ type: "test" });
    });

    it("should throw expired token error", () => {
      const expiredToken = jwt.sign({ type: "test" }, jwtSecret, {
        expiresIn: 0,
      });
      expect(function () {
        verify({ token: expiredToken, jwtSecret });
      }).to.throw(expiredOrInvalidTokenError);
    });

    it("should throw invalid token error", () => {
      const invalidToken = "invalidToken";
      expect(function () {
        verify({ token: invalidToken, jwtSecret });
      }).to.throw(expiredOrInvalidTokenError);
    });
  });

  describe("Validate parameter", () => {
    it("should pass without any error", async () => {
      await validate({
        schema: loginSchema,
        value: { id: "example", pw: "example", anyData: 1234 },
      });
    });

    it("should throw invalid parameter error", () => {
      expect(
        validate({
          schema: loginSchema,
          value: { pw: "example", anyData: 1234 },
        })
      ).to.rejectedWith(invalidParameterError);
    });
  });
});
