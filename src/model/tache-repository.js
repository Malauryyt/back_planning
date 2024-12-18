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
                ORDER BY  statut desc`,
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


exports.getTacheByProjet = async (id_projet, id_user) => {
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
                where T.id_projet = :id_projet
                and T.id_user = U.id_user
                and T.id_user = :id_user
                ORDER BY  statut desc`,
            {
                replacements: {  id_projet, id_user }
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

exports.getTacheMine = async (id_user) => {
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
                 U.trigramme,
                 P.libelle nomprojet,
                 P.trigramme triprojet
                FROM tache T, "user" U, projet P
                where T.id_user = :id_user
                and T.id_user = U.id_user
                and T.id_projet = P.id_projet
                and T.statut <> 100
                ORDER BY  T."dateDemarrage" desc`,
            {
                replacements: { id_user }
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
        return 500;
    }
};

exports.modifTache = async (id, libelle, description, operation,  dateDebutTheo, dateDema,
                            charge, statut, id_user, id_tache, id_jalon, id_projet) => {
    try {
        // Mise à jour du projet
        console.log("mon id :", id)
        const projet = await sequelize.query(
            `UPDATE "tache" 
       SET libelle = :libelle,
           description =:description,
           operation=:operation,
           "dateDebutTheorique" =:dateDebutTheo,
           "dateDemarrage" =:dateDema,
           charge =:charge,
           statut =:statut,
           id_user =:id_user,
           id_tache =:id_tache,
           id_jalon=:id_jalon,
           id_projet =:id_projet
       WHERE tache.id = :id;`,
            {
                replacements: { libelle, description, operation,  dateDebutTheo, dateDema,
                    charge, statut, id_user, id_tache, id_jalon, id_projet, id }
            }
        )
            .then(([results, metadata]) => {
                console.log("Modification de la tache effectuée.", results);
            });

        return 1; // Retourner 1 pour indiquer le succès
    } catch (error) {
        console.error('Erreur lors de la modification du tache:', error);
        return 500; // Retourner 0 en cas d'erreur
    }
};


exports.deleteTache= async (id) => {
    try {
        const result = await Tache.destroy({ where: { id: id } });
        if (result === 0) {
            console.log(`Aucune tache trouvé avec l'ID ${id} pour suppression.`);
            return 0;
        }
        console.log(`Tache avec l'ID ${id} supprimée avec succès.`);
        return 1;
    } catch (error) {
        console.error('Erreur lors de la suppression de la tache:', error);
        return 500;
    }
};
