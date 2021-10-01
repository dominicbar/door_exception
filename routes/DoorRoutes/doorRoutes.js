"use strict";

const {
  doorController: { DoorController },
} = require("../../src/controllers/doorController");

function DoorRoutes(app) {
  app.post("/door_events", DoorController.addUserData);
}

module.exports.DoorRoutes = DoorRoutes;
