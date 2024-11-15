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
            return false;
        }
        console.log(`Projet avec l'ID ${id} supprimé avec succès.`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        return false;
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
        const projet = await Projet.findOne({ where: { id: id } });
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
        const projets = await Projet.findAll({
            where: {
                id_user: {
                    [Op.ne]: id_user // Récupérer les projets avec un id_user différent de celui fourni
                }
            }
        });

        if (projets.length === 0) {
            console.log(`Aucun projet trouvé avec un id_user différent de ${id_user}.`);
        }

        return projets;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return [];
    }
};

