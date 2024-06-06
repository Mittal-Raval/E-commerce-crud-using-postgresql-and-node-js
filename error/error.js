class RequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
class BadRequestError extends RequestError {
  constructor(message) {
    super(message, 400);
    this.message = message;
  }
}

class NotFoundError extends RequestError {
  constructor(message) {
    super(message, 404);
    this.message = message;
  }
}

export { RequestError, BadRequestError, NotFoundError };
