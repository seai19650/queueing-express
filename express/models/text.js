'use strict';
module.exports = (sequelize, DataTypes) => {
  const Text = sequelize.define('Text', {
    path: DataTypes.STRING,
    perspective: DataTypes.STRING
  }, {})
  Text.associate = function(models) {
    Text.belongsTo(models.Request, {
      foreignKey: 'requestId'
    })
  }
  return Text
}