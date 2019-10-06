'use strict';
module.exports = (sequelize, DataTypes) => {
  const Estimate = sequelize.define('Estimate', {
    brand: DataTypes.STRING,
    series: DataTypes.STRING,
    year: DataTypes.STRING,
    damage: DataTypes.STRING,
    cost: DataTypes.INTEGER
  }, {});
  Estimate.associate = function(models) {
    // associations can be defined here
  };
  return Estimate;
};