const {sequelize} = require("../datamodel/db");
const Projet = require('../datamodel/projet.model');


exports.createProjet = async (libelle, id_user, trigramme = "") => {

    try {
        // Initialisation du trigramme si non fourni
        if (trigramme === "") {
            trigramme = libelle.substring(0, 3).toUpperCase();
        }

        const newProjet = await Projet.create({
            libelle: libelle,
            trigramme: trigramme,
            id_user: id_user,
            etat: 1
        });

        console.log('Nouveau projet créé:', newProjet);
        return 1;
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        return 0;
    }
};

// Fonction pour supprimer un projet par son ID
exports.deleteProjet = async (id) => {
    try {
        const result = await Projet.destroy({ where: { id_projet: id } });
        if (result === 0) {
            console.log(`Aucun projet trouvé avec l'ID ${id} pour suppression.`);
            return 0;
        }
        console.log(`Projet avec l'ID ${id} supprimé avec succès.`);
        return 1;
    } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        return 0;
    }
};

exports.modifProjet = async (id, libelle, trigramme, id_user, etat) => {
    try {
        // Générer le trigramme si ce n'est pas fourni
        if (!trigramme || trigramme === "") {
            trigramme = libelle.substring(0, 3).toUpperCase();
        }

        // Mise à jour du projet
        const projet = await sequelize.query(
            `UPDATE "projet" 
       SET libelle = :libelle, trigramme = :trigramme, id_user = :id_user, etat = :etat 
       WHERE id_projet = :id;`,
            {
                replacements: { libelle, trigramme, id_user, etat, id }
            }
        )
            .then(([results, metadata]) => {
                console.log("Modification du projet effectuée.", results);
            });

        return 1; // Retourner 1 pour indiquer le succès
    } catch (error) {
        console.error('Erreur lors de la modification du projet:', error);
        return 0; // Retourner 0 en cas d'erreur
    }
};

exports.getProjetById = async (id) => {
    try {
        const projet = await Projet.findOne({ where: { id_projet: id } });
        if (!projet) {
            console.log(`Projet avec l'ID ${id} non trouvé.`);
            return null;
        }
        return projet;
    } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
        return 0;
    }
};

// Fonction pour récupérer les projets par l'ID de l'utilisateur
exports.getProjetsByUserId = async (id_user) => {
    try {
        const projets = await Projet.findAll({ where: { id_user: id_user } });
        return projets;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets pour cet utilisateur:', error);
        return [];
    }
};

// Fonction pour récupérer tous les projets où id_user est différent d'un certain ID
exports.getProjetsDifferentUser = async (id_user) => {
    try {

        const projet = await sequelize.query(
            `SELECT id_projet, libelle,  trigramme, id_user, etat
                 FROM projet
                where id_user <> :id_user;`,
                    {
                        replacements: {  id_user }
                    }
                 )
            .then(([results, metadata]) => {
                console.log("Projet trouvé", results);
                return results;
            });

        if (projet.length === 0) {
            console.log(`Aucun projet trouvé avec un id_user différent de ${id_user}.`);
        }
        return projet;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return 0;
    }
};

// Fonction pour récupérer tous les projets où id_user à une taches dans le projet
exports.getProjetsSuivit = async (id_user) => {
    try {

        const projet = await sequelize.query(
            `SELECT projet.id_projet, projet.libelle,  trigramme, projet.id_user, etat
                 FROM projet, tache
                where tache.id_projet = projet.id_projet
                and tache.id_user = :id_user;`,
            {
                replacements: {  id_user }
            }
        )
            .then(([results, metadata]) => {
                console.log("Projet trouvé", results);
                return results;
            });

        if (projet.length === 0) {
            console.log(`Aucun projet trouvé dont une tache trouvé a un id_user ${id_user}.`);
        }
        return projet;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return 0;
    }
};

