'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    filename: DataTypes.STRING
  }, {});
  Result.associate = function(models) {
    Result.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'request'
    })
    Result.hasMany(models.Progress, {
      foreignKey: 'requestId',
      as: 'progresses'
    })
  };
  return Result;
};