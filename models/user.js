'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}
User.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User',
});

module.exports = User;
