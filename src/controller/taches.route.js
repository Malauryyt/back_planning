const express = require('express');
const router = express.Router();
const tacheRepository = require('../model/tache-repository');

router.get("/getTacheByJalon/:id_jalon", async(req,res) =>{

    const tache =  await tacheRepository.getTacheByJalon(req.params.id_jalon) ;
    console.log("ma tache", tache)
    if(tache !=500){

        res.status(200).json( tache);
    }
    else{
        res.status(400).send("Erreur lors de la récupération de tache");
    }

});

exports.initializeRoutesTache = () => router;