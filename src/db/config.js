const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('quiz_chosesang', 'quiz_chosesang', '0b0bfeb0f96832d96c3e1bb0e6ad2659b19a4777', {
    host: 'oro9h.h.filess.io',
    port:"3307",
    dialect:'mysql' , 
    timezone: '+05:30',
  });

module.exports = sequelize;