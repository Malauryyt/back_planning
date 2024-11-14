const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const user = sequelize.define(
    'user',
    {
        id_user: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        login: { type: DataTypes.STRING, allowNull: false },
        mdp: { type: DataTypes.STRING, allowNull: false },
        nom: { type: DataTypes.STRING, allowNull: false },
        prenom: { type: DataTypes.STRING, allowNull: false },
        trigramme: { type: DataTypes.STRING, allowNull: false },
        droit: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },

    },
    { tableName: 'user' },
);
module.exports = user;