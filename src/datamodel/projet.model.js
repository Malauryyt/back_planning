const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const projetModel = sequelize.define(
    'projet',
    {
        id_projet: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER },
        libelle: { type: DataTypes.STRING, allowNull: false },
        trigramme : { type: DataTypes.STRING, allowNull: false },
        etat : { type: DataTypes.INTEGER, allowNull: false },
        id_user: { foreignKey:true, type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'projet' },
);
module.exports = projetModel;