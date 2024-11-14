const express = require('express');
const router = express.Router();
const {generateAuthToken} = require('../security/auth')
const bcrypt = require("bcryptjs");

const { body, validationResult } = require('express-validator');

const userRepository = require('../model/user-repository');

router.post("/crea", body("login"), body("mdp"), body("nom"), body("prenom"), async(req,res) => {
    const createUser =  await userRepository.createUser(req.body.login, req.body.mdp, req.body.nom, req.body.prenom);
    console.log(createUser);
    if(createUser === 1){
        res.status(200).end();
    }
    else{
        res.status(400).send("login déjà pris.");
    }
});

router.post("/auth/:login/:mdp", async(req,res) =>{

    const user =  await userRepository.isUser(req.params.login) ;

    if(user != undefined){

        if (bcrypt.compareSync(req.params.mdp, user.mdp)) {

            const token = generateAuthToken(user.id_user, user.login,  user.trigramme, user.droit);
            res.status(200).json({ token });
            console.log(user.login + " vient de se connecter");

        } else {
            res.status(400).send("Login ou mot de passe incorrect");
            console.log(user.login + " n'a pas réussit à se connecter");
        }
    }
    else{
        res.status(400).send("Login ou mot de passe incorrect");
        return false;
    }

});

exports.initializeRoutesUser = () => router;