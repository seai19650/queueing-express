'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    project_id: DataTypes.STRING,
    project_name: DataTypes.STRING,
    documents: DataTypes.TEXT
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
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
    Request.hasOne(models.Result, {
      foreignKey: 'request_id',
      as: 'result',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  }
  return Request
}