const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true  
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalQuestions: {  
    type: DataTypes.INTEGER,
    allowNull: false
  },
  passingStatus: {  
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  quizName: {  
    type: DataTypes.STRING,
    allowNull: false
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Result;
