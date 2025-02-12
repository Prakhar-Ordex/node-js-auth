const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.TEXT, // Change JSON to TEXT
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('options')); // Convert TEXT to JSON when retrieving
    },
    set(value) {
      this.setDataValue('options', JSON.stringify(value)); // Convert JSON to TEXT when saving
    }
  },
  correctAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Question;
