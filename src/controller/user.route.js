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

router.get("/auth/:login/:mdp", async(req,res) =>{

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

router.post("/modif", body("id"), body("login"), body("nom"), body("prenom"), body("droit"), body("mdp"), async(req,res) => {

    const modifUser =  await userRepository.modifUsers(req.body.id,req.body.login, req.body.nom, req.body.prenom, req.body.droit,  req.body.mdp);

    if( modifUser === 1){
        res.status(200).end();
    }else{
        res.status(400).send(modifUser);
    }
});

router.get("/getAll", async(req,res) =>{
    const allusers = await userRepository.getAll();

    if( allusers === 0 ){
        res.status(400).send("erreur dans la récupération des utilisateur");
    }
    else{
        res.status(200).json(allusers);
    }
});

router.get("/getOne/:id",async(req,res) =>{
    const user = await userRepository.getOne(req.params.id);

    if( user === 0 ){
        res.status(400).send ("erreur dans la écupération de l'utilisateur " + req.params.id);
    }else{
        res.status(200).json(user);
    }
} );

exports.initializeRoutesUser = () => router;