'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable('accounts',
     {
       _id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
       },
       firstName: {
         type: Sequelize.STRING
       },
       lastName: {
         type: Sequelize.STRING
       },
       email: {
         type: Sequelize.STRING
       },
       contactNumber: {
         type: Sequelize.STRING
       },
       password: {
         type: Sequelize.STRING
       },
       birthday: {
         type: Sequelize.STRING
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
