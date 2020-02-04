'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    projectId: DataTypes.STRING,
    documents: DataTypes.TEXT
  }, {})
  Request.associate = function(models) {
    Request.hasMany(models.Progress, {
      foreignKey: 'requestId',
      as: 'progresses'
    })
    Request.hasOne(models.Result, {
      foreignKey: 'requestId',
      as: 'result'
    })
  }
  return Request
}