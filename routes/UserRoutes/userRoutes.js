"use strict";

const {
  userController: { UserController },
} = require("../../src/controllers/userController");

function UserRoutes(app) {
  app.get("/users", UserController.addUserData);
}

module.exports.UserRoutes = UserRoutes;
