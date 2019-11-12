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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
