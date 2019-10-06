'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prediction = sequelize.define('Prediction', {
    runAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE,
    result: {
      type: DataTypes.ENUM,
        values: [
          'low',
          'medium',
          'high'
        ]
    }
  }, {});
  Prediction.associate = function(models) {
    Prediction.belongsTo(models.Image)
    Prediction.belongsTo(models.Model)
  };
  return Prediction;
};mjjhjuhhuu