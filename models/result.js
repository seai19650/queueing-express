'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    topic_chart_url: DataTypes.TEXT,
    term_topic_matrix: DataTypes.TEXT,
    document_topic_matrix: DataTypes.TEXT,
    topic_stat: DataTypes.TEXT,
    term_pairs: DataTypes.TEXT,
    unreadable_documents: DataTypes.TEXT,
    undownloadable_documents: DataTypes.TEXT
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'Results'
  });
  Result.associate = function(models) {
    Result.belongsTo(models.Request, {
      foreignKey: 'request_id',
      as: 'request',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    Result.hasMany(models.Progress, {
      sourceKey: 'request_id',
      foreignKey: 'request_id',
      as: 'progresses',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return Result;
};