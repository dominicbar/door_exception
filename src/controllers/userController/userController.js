"use strict";

const { BaseController } = require("../baseController");

const { userActions } = require("../../actions/users");

class UserController extends BaseController {
  constructor(req) {
    super(req);
  }

  async addUserData() {
    try {
     
      let payload = await userActions.addUserData(
          this.reqBody,
          this.models
      )
       return this.respondWithSuccess(payload);
    } catch (error) {
      console.log(error)
        return this.respondWithError(error);
    }
  }



}

module.exports.UserController = {
  UserController: UserController,
  addUserData: async (req) => {
    return await new UserController(req).addUserData();
  }
};