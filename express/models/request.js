'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    brand: DataTypes.STRING,
    series: DataTypes.STRING,
    year: DataTypes.STRING
  }, {})
  Request.associate = function(models) {
    Request.hasMany(models.Image, {
      foreignKey: 'requestId',
      as: 'images'
    })
  }
  return Request
}