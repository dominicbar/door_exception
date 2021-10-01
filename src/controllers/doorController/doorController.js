"use strict";

const { BaseController } = require("../baseController");

const { doorActions } = require("../../actions/doors");

class DoorController extends BaseController {
  constructor(req) {
    super(req);
  }

  async addUserData() {
    try {
      let payload = await doorActions.addUserData(this.reqBody, this.models);
      return this.respondWithSuccess(payload);
    } catch (error) {
      console.log(error);
      return this.respondWithError(error);
    }
  }
}

module.exports.DoorController = {
  DoorController: DoorController,
  addUserData: async (req) => {
    return await new DoorController(req).addUserData();
  },
};
