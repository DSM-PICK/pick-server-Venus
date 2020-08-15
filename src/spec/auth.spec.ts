import * as chai from "chai";
import * as sinon from "sinon";
import * as jwt from "jsonwebtoken";

import { AuthService } from "../services";
import { fakeAdminRepository, fakeLogger } from "./fakes";
import { IAdmin } from "../interfaces";
import { invalidLoginInformationError } from "../errors";

chai.should();

describe("AuthService", () => {
  const jwtSecret = "venus_test";
  let stub;
  const authService = new AuthService(
    fakeAdminRepository,
    fakeLogger,
    jwtSecret
  );

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
        expiresIn: "14d",
      })
      .returns("refresh_token");

    const result = await authService.signIn(admin);
    result.should.be.deep.equal(expectedResult);
  });

  it("should throw invalid login info error with invalid id", (done) => {
    const admin: IAdmin = { id: "invalid", pw: "validpass" };

    authService
      .signIn(admin)
      .then(() => done(new Error("error")))
      .catch((e) => {
        e.should.deep.equal(invalidLoginInformationError);
        done();
      });
  });

  it("should throw invalid login info error with invalid pw", (done) => {
    const admin: IAdmin = { id: "admin", pw: "invalidpass" };

    authService
      .signIn(admin)
      .then(() => done(new Error("err")))
      .catch((e) => {
        e.should.deep.equal(invalidLoginInformationError);
        done();
      });
  });
});
