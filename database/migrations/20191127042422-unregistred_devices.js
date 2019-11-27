'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('unregistered_devices',
      {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      macAddress: {
        type: Sequelize.STRING
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('unregistered_devices');
  }
};
