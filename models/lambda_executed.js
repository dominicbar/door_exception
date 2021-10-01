"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class lambda_executed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  lambda_executed.init(
    {},
    {
      sequelize,
      modelName: "lambda_executed",
    }
  );
  return lambda_executed;
};
