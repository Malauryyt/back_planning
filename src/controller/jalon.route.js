const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const jalonRepository = require('../model/jalon-repository');


router.post("/crea", body("libelle"), body("dateLivPrev"), body("dateCommencement"), body("id_user"),
    body("id_projet"), body("couleur"), async(req,res) => {

        const createJalon=  await jalonRepository.createJalon(req.body.libelle,
                                                            req.body.dateLivPrev,
                                                            req.body.dateCommencement,
                                                            req.body.id_user,
                                                            req.body.id_projet,
                                                            req.body.couleur);

        if(createJalon === 1){
            res.status(200).end();
        }
        else{
            res.status(400).send("Problème lors de la création de projet");
        }
});

router.get("/getJalons/:id_projet",  async(req,res) => {

        const getJalon=  await jalonRepository.getJalonByProjet(req.params.id_projet);

        if(getJalon == 500){
            res.status(400).send("Problème dans la récupération de jalon");

        }
        else{
            res.status(200).json(getJalon);
        }
    });

router.get("/getJalonById/:id_jalon",  async(req,res) => {

    const getJalon=  await jalonRepository.getJalonById(req.params.id_jalon);

    if(getJalon == 500){
        res.status(400).send("Problème dans la récupération du jalon" + req.params.id_jalon);

    }
    else{
        res.status(200).json(getJalon);
    }
});


router.post("/modif", body("id_jalon"), body("libelle"), body('date_liv_prev'),
    body("date_com"), body("id_user"),
    body("id_projet"), body("etat"), body("couleur"), async(req,res) => {

        const modifJalon=  await jalonRepository.modifJalon(req.body.id_jalon,
            req.body.libelle,
            req.body.date_liv_prev,
            req.body.date_com,
            req.body.id_user,
            req.body.id_projet,
            req.body.etat,
            req.body.couleur);

        if(modifJalon === 1){
            res.status(200).end();
        }
        else{
            res.status(400).send("Problème lors de la modification de projet");
        }
    });

router.post("/supp", body("id_jalon"),  async(req,res) => {

        const suppJalon=  await jalonRepository.suppJalon(req.body.id_jalon);

        if(suppJalon === 1){
            res.status(200).end();
        }
        else{
            res.status(400).send("Problème lors de la suppression de projet");
        }
    });


exports.initializeRoutesJalon = () => router;