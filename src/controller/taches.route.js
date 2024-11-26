const express = require('express');
const router = express.Router();
const tacheRepository = require('../model/tache-repository');
const { body, validationResult } = require('express-validator');

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

router.post("/crea", body("libelle"), body("description"), body("operation"), body("dateDebutTheo"), body("dateDema"),
    body("charge"), body("statut"), body("id_user"),
    body("id_tache"), body("id_jalon"), body("id_projet"),  async(req,res) =>{

    const tache =  await tacheRepository.createTache(req.body.libelle,req.body.description,req.body.operation,req.body.dateDebutTheo,
                                                    req.body.dateDema,req.body.charge,req.body.statut,req.body.id_user,req.body.id_tache,
                                                    req.body.id_jalon,req.body.id_projet) ;
    console.log("ma tache", tache)
    if(tache !=500){

        res.status(200).end();
    }
    else{
        res.status(400).send("Erreur lors de la création de tache");
    }

});

exports.initializeRoutesTache = () => router;