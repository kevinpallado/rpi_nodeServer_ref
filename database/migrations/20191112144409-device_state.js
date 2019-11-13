'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable(
     'device_state',
     {
       _id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
       },
       state: {
         type: Sequelize.STRING
       }
     }
   );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('device_state');
  }
};
