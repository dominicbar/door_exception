"use strict";

var ApiBuilder = require("claudia-api-builder"),
  app = new ApiBuilder();

module.exports = app;

const {
  Routes: {
    UserRoutes: { UserRoutes },
    DoorRoutes: { DoorRoutes },
  },
} = require("./routes");

UserRoutes(app);
DoorRoutes(app);

app.get("/health", function () {
  console.log("&***********&&&&&**************");

  return "Healthy";
});
