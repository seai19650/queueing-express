'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    filename: DataTypes.STRING
  }, {});
  Result.associate = function(models) {
    Result.belongsTo(models.Request, {
      foreignKey: 'requestId'
    })
  };
  return Result;
};