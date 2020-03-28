'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.STRING,
        unique: true
      },
      project_name: {
        type: Sequelize.STRING
      },
      documents: {
        type: Sequelize.TEXT
      },
      is_error: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_notified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Requests');
  }
};