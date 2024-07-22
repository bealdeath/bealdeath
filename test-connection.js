const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Andy12987!@#', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
