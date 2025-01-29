const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crud', 'root', '1234', {
    host: 'localhost',
    dialect:'mysql' , 
    timezone: '+05:30',
  });

module.exports = sequelize;