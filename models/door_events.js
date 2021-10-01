"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class door_events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  door_events.init(
    {
      accessPointId: DataTypes.INTEGER,
      orgId: DataTypes.INTEGER,
      doorEventCreatedAt: DataTypes.DATE,
      eventType: DataTypes.STRING,
      eventTime: DataTypes.BIGINT,
      acessPointName: DataTypes.STRING,
      accessPointDirection: DataTypes.STRING,
      siteId: DataTypes.INTEGER,
      siteName: DataTypes.STRING,
      siteLocation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "door_events",
    }
  );
  return door_events;
};
