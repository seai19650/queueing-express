'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    filename: DataTypes.STRING
  }, {charset: 'utf8mb4'});
  Result.associate = function(models) {
    Result.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'request'
    })
    Result.hasMany(models.Progress, {
      sourceKey: 'requestId',
      foreignKey: 'requestId',
      as: 'progresses',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  };
  return Result;
};