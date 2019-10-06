'use strict';
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    path: DataTypes.STRING,
    perspective: DataTypes.STRING
  }, {})
  Image.associate = function(models) {
    Image.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'company'
    })
  }
  return Image
}