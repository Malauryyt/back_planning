const {sequelize} = require("../datamodel/db");
const Jalon = require('../datamodel/jalon.model');


exports.createJalon = async (libelle, date_liv_prev, date_commencement = "", id_user, id_projet, ordre) => {

    try {
        // ya t'il plusieur jalon ? si oui vérification de son ordre
        const tabJalon = await this.getJalonByProjet(id_projet);
        if(tabJalon != 0 || tabJalon.length > 0){
            for (const jalon of tabJalon) {
                if(jalon.date_liv_theorique == date_liv_prev ){
                    return {"erreur": "La date de livraison du jalon est identique au jalon : {jalon.libelle}."}
                }
            }
        }

        // const newProjet = await Projet.create({
        //     libelle: libelle,
        //     trigramme: trigramme,
        //     id_user: id_user,
        //     etat: 1
        // });
        //
        // console.log('Nouveau projet créé:', newProjet);
        return 1;
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        return 0;
    }
};

exports.getJalonByProjet = async (id_projet) => {
    try {

        const jalons = await sequelize.query(
            `SELECT jalon.libelle, date_liv_theorique, date_com_theorique, charge, jalon.etat, jalon.id_user, jalon.id_projet,
                        "user".nom, "user".trigramme,
                         projet.libelle as libelleprojet, projet.trigramme as trigrammeprojet
                 FROM jalon, "user", projet
                 where "user".id_user = jalon.id_user
                 and jalon.id_projet = projet.id_projet
                 and jalon.id_projet = :id_projet
                order by date_liv_theorique;`,
            {
                replacements: {  id_projet }
            }
        )
            .then(([results, metadata]) => {
                console.log("Jalons trouvés", results);
                return results;
            });

        return jalons;
    } catch (error) {
        console.error('Erreur lors de la récupération de jalons:', error);
        return 0;
    }
};
