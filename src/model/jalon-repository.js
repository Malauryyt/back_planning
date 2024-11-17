const {sequelize} = require("../datamodel/db");
const Jalon = require('../datamodel/jalon.model');
const JalonRepository = require("../datamodel/jalon.model");


exports.createJalon = async (libelle, date_liv_prev, date_commencement = "", id_user, id_projet) => {

    const tabJalon = await this.getJalonByProjet(id_projet);
    var prece = 0;
    var dateCommencement = "";
    var dateLivPrece = "";
    var idJalonAModif = 0;

    // ya t'il plusieur jalon ? si oui vérification qu'il n'est pas une date identique à un autre et modif date de commencement
    if(tabJalon != 0 && tabJalon.length > 0){

        for (const jalon of tabJalon) {

            if(jalon.date_liv_theorique == date_liv_prev ){
                return 0;
            }
            if( date_liv_prev < jalon.date_liv_theorique && prece == 0){

                idJalonAModif = jalon.id_jalon;
                dateCommencement = dateLivPrece;
                prece += 1;
            }
            dateLivPrece = jalon.date_liv_theorique;
        }
        //si c'est le dernier jalon
        if(prece == 0 ){
            dateCommencement = dateLivPrece
        }

    }

    console.log("Mon jalon à modifier :", idJalonAModif);
    console.log("Ma date à initialiser pour moi  :", dateCommencement);
    console.log("prece :", prece);

    // création de mon nouveau jalon
    async function createJalon(libelle, date_liv_prev, date_commencement, id_user, id_projet) {
        try {
            // calcule de la charge en jour
            const start = new Date(dateCommencement);
            const end = new Date(date_liv_prev);
            const diffTime = end - start;

            // Convertir la différence en jours
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            const charge =  Math.round(diffDays);

            const newJalon = await JalonRepository.create({
                libelle : libelle,
                date_liv_theorique: date_liv_prev ,
                date_com_theorique : date_commencement,
                charge : charge,
                etat : 0,
                id_user: id_user,
                id_projet: id_projet});
            console.log('New jalon created:', newJalon);
        } catch (error) {
            console.error('Error creating new jalon:', error);
        }
    }

    // si on est dans le cas d'un premier projet un date de début est donnée
    if( date_commencement != ""){
        dateCommencement = date_commencement
    }
    createJalon(libelle, date_liv_prev, dateCommencement, id_user, id_projet);
    return 1;

    // console.log('Nouveau projet créé:', newProjet);

    // Jalon à modifier idJalonAModif > on lui assigne la valeur de notre fin théorique
    // Convertir la chaîne de caractères en objet Date
    // const date = new Date(dateString);
    //
    // // Ajouter un jour
    // date.setDate(date.getDate() + 1);
    //
    // // Retourner la nouvelle date au format 'YYYY-MM-DD'
    // return date.toISOString().split('T')[0];


};

exports.getJalonByProjet = async (id_projet) => {
    try {

        const jalons = await sequelize.query(
            `SELECT jalon.id_jalon, jalon.libelle, date_liv_theorique, date_com_theorique, charge, jalon.etat, jalon.id_user, jalon.id_projet,
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
               // console.log("Jalons trouvés", results);
                return results;
            });

        return jalons;
    } catch (error) {
        console.error('Erreur lors de la récupération de jalons:', error);
        return 0;
    }
};
