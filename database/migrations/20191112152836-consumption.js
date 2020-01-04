'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable('consumptions',
   {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voltage: {
      type: Sequelize.STRING
    },
    current: {
      type: Sequelize.STRING
    },
    power: {
      type: Sequelize.STRING
    },
    dateRecorded: {
      type: Sequelize.DATE
    },
    deviceID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'registered_devices',
        key: '_id'
      }
    }
   });
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('consumptions');
  }
};
