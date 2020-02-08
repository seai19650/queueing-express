'use strict';
module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
    status: DataTypes.STRING
  }, {});
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