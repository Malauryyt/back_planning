const {sequelize} = require("../datamodel/db");
const Tache = require('../datamodel/taches.model');
const Projet = require("../datamodel/projet.model");

exports.getTacheByJalon = async (id_jalon) => {
    try {

        const taches = await sequelize.query(
            `SELECT
                 T.id,
                 T.libelle,
                 T.description,
                 T.operation,
                 T."dateDebutTheorique",
                 T."dateDemarrage",
                 T.charge,
                 T.statut,
                 T.id_user,
                 T.id_tache,
                 T.id_jalon,
                 T.id_projet,
                 U.nom,
                 U.trigramme
                 FROM tache T, "user" U
                where T.id_jalon = :id_jalon
                and T.id_user = U.id_user
                `,
            {
                replacements: {  id_jalon }
            }
        )
            .then(([results, metadata]) => {
                 console.log("taches trouvés", results);
                return results;
            });

        return taches;
    } catch (error) {
        console.error('Erreur lors de la récupération de tache:', error);
        return 500;
    }
};

exports.createTache = async (libelle, description, operation,  dateDebutTheo, dateDema,
                              charge, statut, id_user, id_tache, id_jalon, id_projet) => {

    try {

        const newProjet = await Tache.create({
            libelle: libelle,
            description: description,
            operation: operation,
            dateDebutTheorique: dateDebutTheo,
            dateDemarrage: dateDema,
            charge: charge,
            statut: statut,
            id_user: id_user,
            id_tache: id_tache,
            id_jalon: id_jalon,
            id_projet: id_projet
        });

        console.log('Nouvelle tache créée:', newProjet);
        return 1;
    } catch (error) {
        console.error('Erreur lors de la création de la tache:', error);
        return 0;
    }
};
