'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this is the Sequelize instance

class Table extends Model {
  static associate(models) {
    Table.hasMany(models.Record, { foreignKey: 'tableId', as: 'records' });
  }
}
Table.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // Pass the Sequelize instance here
  modelName: 'Table',
});

module.exports = Table;
