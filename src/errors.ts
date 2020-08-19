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
const expiredOrInvalidTokenError = new HttpError(
  "Expired or invalid token",
  401,
  ""
);

export {
  invalidLoginInformationError,
  invalidParameterError,
  apiNotFoundError,
  expiredOrInvalidTokenError,
};
