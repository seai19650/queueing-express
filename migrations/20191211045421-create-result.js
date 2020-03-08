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
      topic_chart_url: {
        type: Sequelize.TEXT('long')
      },
      term_topic_matrix: {
        type: Sequelize.TEXT('long')
      },
      document_topic_matrix: {
        type: Sequelize.TEXT('long')
      },
      topic_stat: {
        type: Sequelize.TEXT('long')
      },
      term_pairs: {
        type: Sequelize.TEXT('long')
      },
      unreadable_documents: {
        type: Sequelize.TEXT('long')
      },
      undownloadable_documents: {
        type: Sequelize.TEXT('long')
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