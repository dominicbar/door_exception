"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class door_exception_report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  door_exception_report.init(
    {
      orgId: DataTypes.INTEGER,
      accessPointId: DataTypes.INTEGER,
      accessName: DataTypes.STRING,
      accessPointDirection: DataTypes.STRING,
      eventTime: DataTypes.INTEGER,
      siteId: DataTypes.INTEGER,
      siteName: DataTypes.STRING,
      siteLocation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "door_exception_report",
    }
  );
  return door_exception_report;
};
