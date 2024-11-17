const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const jalonRepository = require('../model/jalon-repository');


router.post("/crea", body("libelle"), body("dateLivPrev"), body("dateCommencement"), body("id_user"),
    body("id_projet"), async(req,res) => {

        const createJalon=  await jalonRepository.createJalon(req.body.libelle,
                                                            req.body.dateLivPrev,
                                                            req.body.dateCommencement,
                                                            req.body.id_user,
                                                            req.body.id_projet);

        if(createJalon === 1){
            res.status(200).end();
        }
        else{
            res.status(400).send("Problème lors de la création de projet");
        }
});


exports.initializeRoutesJalon = () => router;