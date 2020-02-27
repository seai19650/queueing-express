'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    projectId: DataTypes.STRING,
    documents: DataTypes.TEXT
  }, {charset: 'utf8mb4'})
  Request.associate = function(models) {
    Request.hasMany(models.Progress, {
      foreignKey: 'requestId',
      as: 'progresses',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
    Request.hasOne(models.Result, {
      foreignKey: 'requestId',
      as: 'result',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  }
  return Request
}