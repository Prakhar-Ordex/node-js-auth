const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const User = sequelize.define('auth_user', {
    username: {
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: 'User already exists'
        },
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Invalid email format',
                args: true
            }
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min:{
                args: 6,
                msg: 'Password must be at least 8 characters long'
            }
        }
    },
    access_token:{
        type: DataTypes.STRING,
        allowNull: true
    },
    refresh_token: { 
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;
