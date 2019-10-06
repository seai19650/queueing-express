'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Model', {
    name: DataTypes.STRING
  }, {});
  Model.associate = function(models) {
    // associations can be defined here
  };
  return Model;
};