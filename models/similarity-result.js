'use strict';
module.exports = (sequelize, DataTypes) => {
  const SimilarityResult = sequelize.define('SimilarityResult', {
    topic_similarity: DataTypes.TEXT,
    unreadable_documents: DataTypes.TEXT,
    undownloadable_documents: DataTypes.TEXT
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'SimilarityResults'
  });
  SimilarityResult.associate = function(models) {
    SimilarityResult.belongsTo(models.Request, {
      foreignKey: 'request_id',
      as: 'request',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    SimilarityResult.hasMany(models.Progress, {
      sourceKey: 'request_id',
      foreignKey: 'request_id',
      as: 'progresses',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return SimilarityResult;
};