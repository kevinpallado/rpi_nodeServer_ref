'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.createTable('consumptions',
   {
    _id: {
      type: Sequelize.INTEGER
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
