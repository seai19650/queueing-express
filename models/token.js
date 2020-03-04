'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    token: DataTypes.STRING
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'Tokens'
  });
  Token.associate = function(models) {
    // associations can be defined here
  };
  return Token;
};