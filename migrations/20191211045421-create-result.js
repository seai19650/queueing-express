'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      term_topic_matrix: {
        type: Sequelize.TEXT
      },
      document_topic_matrix: {
        type: Sequelize.TEXT
      },
      topic_stat: {
        type: Sequelize.TEXT
      },
      term_pairs: {
        type: Sequelize.TEXT
      },
      unreadable_documents: {
        type: Sequelize.TEXT
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Requests',
          key: 'id'
        },
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
    return queryInterface.dropTable('Results');
  }
};