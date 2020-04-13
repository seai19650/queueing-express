'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    project_id: DataTypes.STRING,
    project_name: DataTypes.STRING,
    documents: DataTypes.TEXT,
    max_no_topic: DataTypes.INTEGER,
    criteria: DataTypes.INTEGER,
    is_error: DataTypes.BOOLEAN,
    is_notified: DataTypes.BOOLEAN,
    is_completed: DataTypes.BOOLEAN,
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'Requests'
  })
  Request.associate = function(models) {
    Request.hasMany(models.Progress, {
      foreignKey: 'request_id',
      as: 'progresses',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    Request.hasOne(models.Result, {
      foreignKey: 'request_id',
      as: 'result',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    Request.hasOne(models.SimilarityResult, {
      foreignKey: 'request_id',
      as: 'similarityResult',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  }
  return Request
}