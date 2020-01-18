'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable('registered_devices',
   {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    application: {
      type: Sequelize.STRING
    },
    deviceLists: {
      type: Sequelize.STRING
    },
    area: {
      type: Sequelize.STRING
    },
    macAddress: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.BOOLEAN
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    accountID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'accounts',
        key: '_id'
      },
      onDelete: 'cascade'
    },
   });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('registered_devices');
  }
};
