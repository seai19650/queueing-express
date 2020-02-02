'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Requests', [{
        brand: 'Toyota',
        series: 'Altis',
        year: '2015',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Requests', [{
      brand: 'Toyota',
      series: 'Altis',
      year: '2015',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  }
};
