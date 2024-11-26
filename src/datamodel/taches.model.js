const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const tacheModel = sequelize.define(
    'tache',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER },
        libelle: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        operation: { type: DataTypes.TEXT, allowNull: false },
        dateDebutTheorique: { type: DataTypes.DATEONLY, allowNull: false },
        dateDemarrage: { type: DataTypes.DATEONLY, allowNull: true },
        charge : { type: DataTypes.INTEGER, allowNull: false },
        statut : { type: DataTypes.INTEGER, allowNull: false },
        id_user: { foreignKey:true, type: DataTypes.INTEGER, allowNull: false },
        id_tache: { foreignKey:true, type: DataTypes.INTEGER, allowNull: true },
        id_jalon: { foreignKey:true, type: DataTypes.INTEGER, allowNull: false },
        id_projet: { foreignKey:true, type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'tache' },
);
module.exports = tacheModel;