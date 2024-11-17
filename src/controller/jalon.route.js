const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const jalonRepository = require('../model/jalon-repository');


router.post("/crea",
    body("libelle"),
    body("date_liv_prev"),
    body("date_commencement"),
    body("id_user"),
    body("id_projet"),
    body("ordre"), async(req,res) => {

        const createJalon=  await jalonRepository.createJalon(req.body.libelle,
                                                            req.body.date_liv_prev,
                                                            req.body.date_commencement,
                                                            req.body.id_user,
                                                            req.body.id_projet,
                                                            req.body.ordre);

        if(createJalon === 1){
            res.status(200).end();
        }
        else{
            res.status(400).send("Problème lors de la création de projet");
        }
});


exports.initializeRoutesJalon = () => router;