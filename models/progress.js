'use strict';
module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
    statusCode: DataTypes.STRING,
    payload: DataTypes.STRING
  }, {charset: 'utf8mb4'});
  Progress.associate = function(models) {
    Progress.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'request'
    })
    Progress.belongsTo(models.Result, {
      foreignKey: 'requestId',
      as: 'result'
    })
  };
  return Progress;
};