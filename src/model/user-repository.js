const UserRepository = require('../datamodel/utilisateur.model');
const {sequelize} = require("../datamodel/db")
const bcrypt = require('bcryptjs');
const md5 = require('md5');

const User = require('../datamodel/utilisateur.model');

exports.createUser = async (login, mdp, nom, prenom) =>{
    const  sel = bcrypt.genSaltSync(12);
    const mdphash = bcrypt.hashSync(mdp , sel);

    // vérification que mon utilisateur n'existe pas déjà
    const user = await this.isUser(login);
    if ( user === undefined){

        async function createUser(login, mdp, nom, prenom) {
            try {
                // initialisation du trigramme
                var trigramme = nom.substring(0,3);
                trigramme = trigramme.toUpperCase();

                const newUser = await UserRepository.create({ login : login, mdp: mdp ,nom : nom, prenom:prenom, trigramme: trigramme});
                console.log('New user created:', newUser);
            } catch (error) {
                console.error('Error creating new user:', error);
            }
        }
        createUser(login, mdphash, nom, prenom);
        return 1;
    }
    else{
        return 0;
    }

}

exports.isUser = async (nom_uti) => {

    const user = await sequelize.query(`SELECT id_user, login, mdp, trigramme, droit from "user" where login =  :nom_uti`, { replacements: { nom_uti }})
        .then(([results, metadata]) => {
            return results[0];
        });

    return user;
}

exports.modifUsers = async (id, login, nom, prenom, droit , mdp) =>{

    try{
        const  sel = bcrypt.genSaltSync(12);
        const mdphash = bcrypt.hashSync(mdp , sel);

        var trigramme = nom.substring(0,3);
        trigramme = trigramme.toUpperCase();

        if( mdp != ""){
            const user = await sequelize.query(`UPDATE "user" 
                                            SET login = :login, nom = :nom, prenom= :prenom, droit = :droit , trigramme= :trigramme, mdp = :mdphash
                                            WHERE id_user = :id ;`, { replacements: {  login, nom, prenom, email, trigramme , mdphash, id }})
                .then(([results, metadata]) => {
                    console.log("Modification effectuée.", results);
                });
        }
        else{
            const usersansmdp = await sequelize.query(`UPDATE "user" 
                                            SET login = :login, nom = :nom, prenom= :prenom, trigramme = :trigramme , droit= :droit
                                            WHERE id_user = :id ;`, { replacements: {  login, nom, prenom, trigramme, droit ,  id }})
                .then(([results, metadata]) => {
                    console.log("Modification effectuée.", results);
                });
        }

        return 1;
    } catch (error) {
        console.error('Erreur lors de la modification :', error);
        return 0;
    }

}

exports.getAll = async () => {
    try{
        // Find all users
        const users = await User.findAll();
        console.log('All users:', JSON.stringify(users, null, 2));
        return users;
    }
    catch(error){
        return 0;
        console.log(error);
    }
}

exports.getOne = async (id) => {
    try{
        const user = await sequelize.query(`SELECT id_user, login, mdp, nom, prenom,  trigramme, droit
                                            from "user" 
                                            where  id_user = :id `,{ replacements: {  id }})
            .then(([results, metadata]) => {
                return results[0];
            });
        return user;

    }
    catch(error){
        console.log(error);
        return 0;
    }
}

