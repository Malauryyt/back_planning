const UserRepository = require('../datamodel/utilisateur.model');
const {sequelize} = require("../datamodel/db")
const bcrypt = require('bcryptjs');
const md5 = require('md5');

exports.createUser = async (login, mdp, nom, prenom) =>{
    const  sel = bcrypt.genSaltSync(12);
    const mdphash = bcrypt.hashSync(mdp , sel);

    // vérification que mon utilisateur n'existe pas déjà
    const user = await this.isUser(login);
    if ( user === undefined){

        async function createUser(login, mdp, nom, prenom) {
            try {
                const trigramme = nom.substring(0.3);
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

