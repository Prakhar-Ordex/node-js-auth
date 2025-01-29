const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Employee = sequelize.define('Employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    joiningDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = Employee;
