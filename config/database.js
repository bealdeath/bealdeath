const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:Andy12987%21%40%23@localhost:5432/Magictable', {
  dialect: 'postgres',
});

module.exports = sequelize;
