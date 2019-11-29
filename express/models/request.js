'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    brand: DataTypes.STRING,
    series: DataTypes.STRING,
    year: DataTypes.STRING
  }, {})
  Request.associate = function(models) {
    Request.hasMany(models.Progress, {
      foreignKey: 'requestId',
      as: 'progresses'
    })
  }
  return Request
}