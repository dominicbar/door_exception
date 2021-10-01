"use strict";

var ApiBuilder = require("claudia-api-builder");
const {
    BadRequestError,
    NotAuthorizedError,
    ResourceNotFoundError,
    InternalError,
    NotAuthenticatedError
  } = require("../errors");
const models = require("../../models");


// this.expressRequest = req;
// this.reqBody = req.body;
// this.params = req.params;
// this.query = req.query;
// this.headers = req.headers;
// this.response = res;
// this.models = models;

class BaseController {
  constructor(req) {
    this.reqBody = req.body;
    this.requestContext = req.proxyRequest.requestContext;
    this.headers = req.proxyRequest.headers;
    this.params = req.proxyRequest.pathParameters;
    this.query = req.queryString;
    this.models = models;
    this.files = req.files;
  }

  respond(payload, status = 200, headers = null) {
    return new ApiBuilder.ApiResponse(payload, headers, status);
  }

  respondWithError(err) {
    if (err instanceof ResourceNotFoundError) {
     return this.respond({ type: "error", message: err.message }, 404);
    } else if (err instanceof BadRequestError) {
    return  this.respond({ type: "error", message: err.message }, 400);
    } else if (err instanceof NotAuthorizedError) {
        return this.respond({ type: "error", message: err.message }, 403);
    } else if (err instanceof InternalError) {
        return this.respond({ type: "error", message: err.message }, 500);
    } else if (err instanceof NotAuthenticatedError) {
        return this.respond({ type: "error", message: err.message }, 401);
    } else {
        return this.respond({ type: "error", message: err.message }, 500);
    }
  }
  respondWithSuccess(payload, headers = null) {
    if (headers)
    return this.respond({ type: "success", message: payload }, 200, headers);
    return this.respond({ type: "success", message: payload }, 200);
  }
}

module.exports = {
  BaseController: BaseController,
};