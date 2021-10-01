"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("door_events_histories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accessPointId: {
        type: Sequelize.INTEGER,
      },
      orgId: {
        type: Sequelize.INTEGER,
      },
      doorEventCreatedAt: {
        type: Sequelize.DATE,
      },
      eventType: {
        type: Sequelize.STRING,
      },
      eventTime: {
        type: Sequelize.BIGINT,
      },
      acessPointName: {
        type: Sequelize.STRING,
      },
      accessPointDirection: {
        type: Sequelize.STRING,
      },
      siteId: {
        type: Sequelize.INTEGER,
      },
      siteName: {
        type: Sequelize.STRING,
      },
      siteLocation: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("door_events_histories");
  },
};
