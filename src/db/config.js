const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sql3761960', 'sql3761960', '2INvZR8GS9', {
    host: 'sql3.freesqldatabase.com',
    dialect:'mysql' , 
    timezone: '+05:30',
  });

module.exports = sequelize;