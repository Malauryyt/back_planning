const {sequelize} = require("../datamodel/db");
const Jalon = require('../datamodel/jalon.model');
const JalonRepository = require("../datamodel/jalon.model");
const bcrypt = require("bcryptjs");
const Projet = require("../datamodel/projet.model");


exports.createJalon = async (libelle, date_liv_prev, date_commencement = "", id_user, id_projet, couleur) => {

    const tabJalon = await this.getJalonByProjet(id_projet);
    var prece = 0;
    var dateCommencement = "";
    var dateLivPrece = "";
    var idJalonAModif = 0;
    var finLivJalonAModif = "";

    // ya t'il plusieur jalon ? si oui vérification qu'il n'est pas une date identique à un autre et modif date de commencement
    if(tabJalon != 0 && tabJalon.length > 0){

        for (const jalon of tabJalon) {

            if(jalon.date_liv_theorique == date_liv_prev ){
                return 0;
            }
            if( date_liv_prev < jalon.date_liv_theorique && prece == 0){

                idJalonAModif = jalon.id_jalon;
                finLivJalonAModif = jalon.date_liv_theorique
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

    // création de mon nouveau jalon
    async function createJalon(libelle, date_liv_prev, date_commencement, id_user, id_projet, couleur) {
        try {
            // calcule de la charge en jour
            const start = new Date(dateCommencement);
            const end = new Date(date_liv_prev);
            const diffTime = end - start;

            // Convertir la différence en jours
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            const charge =  Math.round(diffDays) + 1;

            const newJalon = await JalonRepository.create({
                libelle : libelle,
                date_liv_theorique: date_liv_prev ,
                date_com_theorique : date_commencement,
                charge : charge,
                etat : 0,
                id_user: id_user,
                id_projet: id_projet,
                couleur: couleur});
            console.log('New jalon created:', newJalon);
        } catch (error) {
            console.error('Error creating new jalon:', error);
            return 0;
        }
    }

    // si on est dans le cas d'un premier projet un date de début est donnée
    if( date_commencement != ""){
        dateCommencement = date_commencement
    }
    else{
        //Calcule de la date de commencement ( on y ajoute un jour)
        const date = new Date(dateCommencement);
        date.setDate(date.getDate() + 1);

        // Retourner la nouvelle date au format 'YYYY-MM-DD'
        dateCommencement =  date.toISOString().split('T')[0];
    }

    // création de mon nouveau jalon
    const nouvJalon = createJalon(libelle, date_liv_prev, dateCommencement, id_user, id_projet, couleur);
    if(nouvJalon == 0 ){
        return 0;
    }

    // modification de la date de commencement d'un jalon
    if( idJalonAModif != 0){
        //ReCalcule de la date de commencement ( on y ajoute un jour)
            const date = new Date(date_liv_prev);
            date.setDate(date.getDate() + 1);

            // Retourner la nouvelle date au format 'YYYY-MM-DD'
            date_liv_prev =  date.toISOString().split('T')[0];

        // Recalcule de la charge en jour
        const start = new Date(date_liv_prev);
        const end = new Date(finLivJalonAModif);
        const diffTime = end - start;

        // Convertir la différence en jours
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const charge =  Math.round(diffDays);

        const modif =  await this.modifDateCom(idJalonAModif, date_liv_prev, charge  + 1)
        if(modif != 1){
            return 0;
        }
    }

    return 1;

};

exports.getJalonByProjet = async (id_projet) => {
    try {

        const jalons = await sequelize.query(
            `SELECT jalon.id_jalon, jalon.libelle,couleur, date_liv_theorique, date_com_theorique, charge, jalon.etat, jalon.id_user, jalon.id_projet,
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
        console.error('Erreur lors de la récupération de jalons ( Getjalon by projet:', error);
        return 500;
    }
};

exports.getJalonById = async (id_jalon) => {
    try {

        const jalons = await sequelize.query(
            `SELECT jalon.id_jalon, jalon.libelle,couleur, date_liv_theorique, date_com_theorique, charge, jalon.etat, jalon.id_user, jalon.id_projet,
                        "user".nom, "user".trigramme,
                         projet.libelle as libelleprojet, projet.trigramme as trigrammeprojet
                 FROM jalon, "user", projet
                 where "user".id_user = jalon.id_user
                 and jalon.id_projet = projet.id_projet
                 and jalon.id_jalon = :id_jalon;`,
            {
                replacements: {  id_jalon }
            }
        )
            .then(([results, metadata]) => {
                // console.log("Jalons trouvés", results);
                return results;
            });

        return jalons;
    } catch (error) {
        console.error('Erreur lors de la récupération de jalons:', error);
        return 500;
    }
};

exports.modifDateCom = async (id_jalon, date_com, charge) =>{

    try{
            const jalonModif = await sequelize.query(`UPDATE "jalon" 
                                            SET date_com_theorique = :date_com, charge = :charge
                                            WHERE id_jalon = :id_jalon ;`, { replacements: {  date_com, charge, id_jalon}})
                .then(([results, metadata]) => {
                    console.log("Modification date effectuée.", results);
                });

        return 1;
    } catch (error) {
        console.error('Erreur lors de la modification du jalon:', error);
        return 0;
    }
}

exports.modifJalon = async (id_jalon, libelle, date_liv_prev, date_commencement, id_user, id_projet, etat, couleur) => {

    const tabJalon = await this.getJalonByProjet(id_projet);

    const index = tabJalon.findIndex(jalon => jalon.id_jalon === id_jalon);
    if(index === -1){
        return 0;
    }

    // on récupère les anciennes valeurs
    var infoJalons = tabJalon[index] ;
    var infoJalonsAnte = tabJalon[index - 1 ] ;
    var infoJalonsSuiv = tabJalon[index + 1 ] ;


    // // modification de mon jalon
    async function modifJalon(id_jalon, libelle, date_liv_prev, date_commencement, id_user, etat, couleur) {
        try{
            // calcule de la charge en jour
            const start = new Date(date_commencement);
            const end = new Date(date_liv_prev);
            const diffTime = end - start;

            // Convertir la différence en jours
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            const charge =  Math.round(diffDays) + 1;
            console.log("calcule charge", Math.round(diffDays))
            console.log(charge)
            console.log(start)
            console.log(end)

            const jalonModif = await sequelize.query(`UPDATE "jalon"
                                            SET libelle = :libelle,
                                                date_liv_theorique= :date_liv_prev,
                                                date_com_theorique = :date_commencement,
                                                id_user = :id_user,
                                                etat = :etat,
                                                couleur = :couleur,
                                                charge = :charge
                                            
                                            WHERE id_jalon = :id_jalon ;`, { replacements: {  libelle, date_liv_prev,date_commencement,
                                                                                                     id_user, etat, couleur, charge, id_jalon}})
                .then(([results, metadata]) => {
                    console.log("Modification jalon effectuée.", results);
                });

            return 1;
        } catch (error) {
            console.error('Erreur lors de la modification du jalon:', error);
            return 0;
        }
    }

    //Date de commencement

    if( date_commencement == ""){
        date_commencement = infoJalons.date_com_theorique;
    }
    // Vérification de date
    if(new Date(date_commencement).getTime() >  new Date(date_liv_prev).getTime() ){
        console.log("La date de commencement est supérieur à la date de fin.")
        return 0;
    }
    if(infoJalonsAnte != undefined && new Date(infoJalonsAnte.date_liv_theorique).getTime() >= new Date(date_liv_prev).getTime()  ){
        console.log("La date de fin théorique est inférieur ou égale  à celle du jalon antérieur")
        return 0;
    }
    if(infoJalonsSuiv != undefined && new Date(infoJalonsSuiv.date_liv_theorique).getTime() <= new Date(date_liv_prev).getTime()  ){
        console.log("La date de fin théorique est inférieur ou égale à celle du jalon suivant")
        return 0;
    }

    console.log("ma dateeee" , date_commencement)

    const modifJal = await modifJalon(id_jalon , libelle, date_liv_prev, date_commencement, id_user,  etat, couleur);



    // modification de la date de commencement du jalon suivant

    if( infoJalonsSuiv != undefined){

        console.log( "Jalon a modifier", infoJalonsSuiv)

        //ReCalcule de la date de commencement ( on y ajoute un jour)
        const date = new Date(date_liv_prev);
        date.setDate(date.getDate() + 1);

        // Retourner la nouvelle date au format 'YYYY-MM-DD'
        date_liv_prev =  date.toISOString().split('T')[0];

        // Recalcule de la charge en jour
        const start = new Date(date_liv_prev);
        const end = new Date(infoJalonsSuiv.date_liv_theorique);
        const diffTime = end - start;

        // Convertir la différence en jours
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const charge =  Math.round(diffDays);

        const modif =  await this.modifDateCom(infoJalonsSuiv.id_jalon, date_liv_prev, charge  + 1)
        if(modif != 1){
            return 0;
        }
    }

    return 1;

};

exports.suppJalon = async (id_jalon, id_projet ) => {

    const monJalon = await this.getJalonById(id_jalon);
    const tabJalon = await this.getJalonByProjet(monJalon[0].id_projet);


    const index = tabJalon.findIndex(jalon => jalon.id_jalon === id_jalon);
    if(index === -1){
        return 0;
    }

    if (index === 0 || index === (tabJalon.length - 1 ) ){
        console.log("c'est un jalon en extrémité")

        try {
            const result = await Jalon.destroy({ where: { id_jalon: id_jalon } });
            if (result === 0) {
                console.log(`Aucun jalon trouvé avec l'ID ${id_jalon} pour suppression.`);
                return 0;
            }
            console.log(`Jalon avec l'ID ${id_jalon} supprimé avec succès.`);
            return 1;
        } catch (error) {
            console.error('Erreur lors de la suppression du jalon:', error);
            return 0;
        }


    }
    else{
        console.log("Impossible de supprimer un jalon au mileu.")
        return 0;
    }

};
