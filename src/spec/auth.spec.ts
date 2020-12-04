import * as sinon from "sinon";
import * as jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";

import { AuthService } from "../services";
import { FakeAdminRepository } from "./fakes";
import { IAdmin } from "../interfaces";
import {
  invalidLoginInformationError,
  invalidTokenError,
  notRefreshTokenError,
} from "../errors";

use(chaiAsPromised);

describe("AuthService", () => {
  const jwtSecret = "venus_test";
  let stub;
  const authService = new AuthService(FakeAdminRepository.default, jwtSecret);

  describe("signIn", () => {
    beforeEach(() => {
      stub = sinon.stub(jwt, "sign");
    });

    afterEach(() => {
      stub.restore();
    });

    it("should return token with valid id and pw", async () => {
      const expectedResult = {
        access_token: "access_token",
        refresh_token: "refresh_token",
      };
      const admin: IAdmin = { id: "admin", pw: "validpass" };

      stub
        .withArgs({ id: "admin", type: "access" }, jwtSecret, {
          expiresIn: "30m",
        })
        .returns("access_token")
        .withArgs({ id: "admin", type: "refresh" }, jwtSecret, {
          expiresIn: "7d",
        })
        .returns("refresh_token");

      const result = await authService.signIn(admin);
      expect(result).to.deep.equal(expectedResult);
    });

    it("should throw invalid login info error with invalid id", () => {
      const admin: IAdmin = { id: "invalid", pw: "validpass" };

      expect(authService.signIn(admin)).to.be.rejectedWith(
        invalidLoginInformationError
      );
    });

    it("should throw invalid login info error with invalid pw", () => {
      const admin: IAdmin = { id: "admin", pw: "invalidpass" };

      expect(authService.signIn(admin)).to.be.rejectedWith(
        invalidLoginInformationError
      );
    });
  });

  describe("tokenRefresh", () => {
    it("should return new access token", () => {
      const refresh_token =
        "Bearer " +
        jwt.sign({ id: "admin", type: "refresh" }, jwtSecret, {
          expiresIn: "3m",
        });
      const token = authService.tokenRefresh({ refresh_token });
      const payload: any = jwt.verify(token.access_token, jwtSecret);
      delete payload.iat;
      delete payload.exp;
      expect(payload).to.deep.equal({ id: "admin", type: "access" });
    });

    it("should throw expired token error", () => {
      const expiredToken =
        "Bearer " +
        jwt.sign({ id: "admin", type: "refresh" }, jwtSecret, {
          expiresIn: 0,
        });
      expect(function () {
        authService.tokenRefresh({ refresh_token: expiredToken });
      }).to.throw(TokenExpiredError);
    });

    it("should throw invalid token error", () => {
      expect(function () {
        authService.tokenRefresh({ refresh_token: "invalid" });
      }).to.throw(invalidTokenError);
    });

    it("should throw not refresh token error", () => {
      const accessToken =
        "Bearer " +
        jwt.sign({ id: "admin", type: "access" }, jwtSecret, {
          expiresIn: "3m",
        });
      expect(function () {
        authService.tokenRefresh({ refresh_token: accessToken });
      }).to.throw(notRefreshTokenError);
    });
  });
});
