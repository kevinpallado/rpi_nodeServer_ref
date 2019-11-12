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
    accountID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'accounts',
        key: '_id'
      },
      onDelete: 'cascade'
    },
    stateID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'device_state',
        key: '_id'
      }
    }
   });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
