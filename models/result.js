'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    term_topic_matrix: DataTypes.TEXT,
    document_topic_matrix: DataTypes.TEXT,
    topic_stat: DataTypes.TEXT,
    term_pairs: DataTypes.TEXT,
    unreadable_documents: DataTypes.TEXT
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'Results'
  });
  Result.associate = function(models) {
    Result.belongsTo(models.Request, {
      foreignKey: 'request_id',
      as: 'request'
    })
    Result.hasMany(models.Progress, {
      sourceKey: 'request_id',
      foreignKey: 'request_id',
      as: 'progresses',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  };
  return Result;
};