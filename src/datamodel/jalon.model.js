const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const jalonModel = sequelize.define(
    'jalon',
    {
        id_jalon: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER },
        libelle: { type: DataTypes.STRING, allowNull: false },
        date_liv_théorique : { type: DataTypes.DATEONLY, allowNull: false },
        date_com_theorique : { type: DataTypes.DATEONLY, allowNull: false },
        charge : { type: DataTypes.INTEGER, allowNull: false },
        etat : { type: DataTypes.INTEGER, allowNull: false },
        id_user: { foreignKey:true, type: DataTypes.INTEGER, allowNull: false },
        id_projet: { foreignKey:true, type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'jalon' },
);
module.exports = jalonModel;