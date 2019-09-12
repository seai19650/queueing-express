'use strict';
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    brand: DataTypes.STRING,
    model: DataTypes.STRING
  }, {});
  Car.associate = function(models) {
    // associations can be defined here
  };
  return Car;
};