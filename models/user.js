'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN
  }, {
    charset: 'utf8mb4',
    underscored: true,
    freezeTableName: true,
    tableName: 'Users',
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  User.beforeCreate (async function(user) {
    const salt = await bcrypt.genSaltSync(10)
    user.password = await bcrypt.hashSync(user.password, salt)
  })
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
  }
  return User;
};