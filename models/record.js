'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this is the Sequelize instance

class Record extends Model {
  static associate(models) {
    Record.belongsTo(models.Table, { foreignKey: 'tableId', as: 'table' });
  }
}
Record.init({
  content: {
    type: DataTypes.JSON,
    allowNull: false
  },
  tableId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tables',
      key: 'id'
    }
  }
}, {
  sequelize, // Pass the Sequelize instance here
  modelName: 'Record',
});

module.exports = Record;
