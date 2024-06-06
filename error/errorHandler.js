import { handleResponse } from "../utils/service.js";

export const handleErrorResponse = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const message = error.message || "Internal Server Error";
  const stack = error.stack || "";
  const route = res.req.originalUrl || res.req.url; // Get the request route
  const type = error.name || "InternalError";
  const statusCode = error.statusCode || 500;

  return handleResponse(res, statusCode, {
    success: false,
    message: message,
    data: {
      stack: stack,
      route: route,
      type: type,
    },
  });
};
