'use strict';
module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
    status_code: DataTypes.STRING,
    payload: DataTypes.STRING
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'Progresses'
  });
  Progress.associate = function(models) {
    Progress.belongsTo(models.Request, {
      foreignKey: 'request_id',
      as: 'request',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    Progress.belongsTo(models.Result, {
      foreignKey: 'request_id',
      as: 'result',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return Progress;
};