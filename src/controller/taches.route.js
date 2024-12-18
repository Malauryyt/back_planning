const express = require('express');
const router = express.Router();
const tacheRepository = require('../model/tache-repository');
const { body, validationResult } = require('express-validator');
const jalonRepository = require("../model/jalon-repository");

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


router.get("/getTacheByProjet/:id_projet/:id_user", async(req,res) =>{

    const tache =  await tacheRepository.getTacheByProjet(req.params.id_projet, req.params.id_user) ;
    console.log("ma tache", tache)
    if(tache !=500){

        res.status(200).json( tache);
    }
    else{
        res.status(400).send("Erreur lors de la récupération de tache");
    }

});

router.get("/getTacheMine/:id_user", async(req,res) =>{

    const tache =  await tacheRepository.getTacheMine(req.params.id_user) ;
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
    if(tache !=500){

        res.status(200).end();
    }
    else{
        res.status(400).send("Erreur lors de la création de la tache");
    }

});

router.post("/modif", body("id"), body("libelle"), body("description"), body("operation"), body("dateDebutTheo"), body("dateDema"),
    body("charge"), body("statut"), body("id_user"),
    body("id_tache"), body("id_jalon"), body("id_projet"),  async(req,res) =>{


        const tache =  await tacheRepository.modifTache(req.body.id, req.body.libelle,req.body.description,req.body.operation,req.body.dateDebutTheo,
            req.body.dateDema,req.body.charge,req.body.statut,req.body.id_user,req.body.id_tache,
            req.body.id_jalon,req.body.id_projet) ;
        console.log("ma tache", tache)
        if(tache !=500){

            res.status(200).end();
        }
        else{
            res.status(400).send("Erreur lors de la modification de la tache");
        }

});

router.post("/supp", body("id"),  async(req,res) => {

    const suppTache =  await tacheRepository.deleteTache(req.body.id);

    if(suppTache === 1){
        res.status(200).end();
    }
    else{
        res.status(400).send("Problème lors de la suppression de projet");
    }
});

exports.initializeRoutesTache = () => router;