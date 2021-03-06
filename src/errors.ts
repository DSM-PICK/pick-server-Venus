class HttpError extends Error {
  public status: number;
  public code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const invalidLoginInformationError = new HttpError("Invalid id or pw", 403, "");
const invalidParameterError = new HttpError("Invalid parameter", 400, "");
const apiNotFoundError = new HttpError("API not found", 404, "");
const expiredTokenError = new HttpError("Expired token", 410, "");
const invalidTokenError = new HttpError("Invalid token", 401, "");
const notAccessTokenError = new HttpError(
  "Authorization is not access token",
  403,
  ""
);
const notRefreshTokenError = new HttpError(
  "X-Refresh-Token is not refresh token",
  403,
  ""
);
const clubNotFoundError = new HttpError("Club not found", 404, "");
const clubLocationNotFoundError = new HttpError(
  "Club location not found",
  404,
  ""
);
const locationAlreadyAssignedError = new HttpError(
  "Location is already assigned",
  409,
  ""
);

export {
  invalidLoginInformationError,
  invalidParameterError,
  apiNotFoundError,
  notAccessTokenError,
  notRefreshTokenError,
  expiredTokenError,
  invalidTokenError,
  clubNotFoundError,
  HttpError,
  clubLocationNotFoundError,
  locationAlreadyAssignedError,
};
