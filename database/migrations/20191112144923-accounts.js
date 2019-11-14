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
         type: Sequelize.DATE
       }
     });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('accounts');
  }
};
