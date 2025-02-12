const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Certificate = sequelize.define('Certificate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true  
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quizName: {  // New field added
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = Certificate;
