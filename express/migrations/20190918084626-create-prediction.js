'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Predictions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      runAt: {
        type: Sequelize.DATE
      },
      finishedAt: {
        type: Sequelize.DATE
      },
      result: {
        type: Sequelize.ENUM,
        values: [
          'low',
          'medium',
          'high'
        ]
      },
      modelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Models',
          key: 'id'
        },
      },
      imageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Images',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Predictions');
  }
};