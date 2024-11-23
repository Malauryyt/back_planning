const express = require('express');
const router = express.Router();
const tacheRepository = require('../model/tache-repository');

router.get("/getTacheByJalon/:id_jalon", async(req,res) =>{

    const user =  await tacheRepository.getTacheByJalon(req.params.id_jalon) ;

    if(user != 0){

        res.status(200).json({ user });
    }
    else{
        res.status(400).send("Login ou mot de passe incorrect");
        return false;
    }

});

exports.initializeRoutesTache = () => router;