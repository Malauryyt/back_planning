const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const projetRepository = require('../model/projet-repository');

router.post("/crea", body("libelle"), body("id_user"), body("trigramme"), async(req,res) => {
    const createProjet=  await projetRepository.createProjet(req.body.libelle, req.body.id_user, req.body.trigramme);

    if(createProjet === 1){
        res.status(200).end();
    }
    else{
        res.status(400).send("Problème lors de la création de projet");
    }
});

// Route pour modifier un projet
router.post('/modif',body("id") ,body("libelle") ,body("trigramme") ,body("id_user") ,body("etat") , async (req, res) => {


    const result = await projetRepository.modifProjet(req.body.id, req.body.libelle, req.body.trigramme, req.body.id_user, req.body.etat);

    if (result === 1) {
        res.json({ message: 'Projet mis à jour avec succès' });
    } else {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
    }
});

// Supprimer un projet par ID
router.post('/supp', body("id"), async (req, res) => {
    const success = await projetRepository.deleteProjet(req.body.id);
    if( success === 1 ){
        res.json({ message: 'Projet supprimé' })
    }
    else{
        res.status(404).json({ error: 'Projet non trouvé' });
    }
});



// Récupérer un projet par ID
router.get('/getOne/:id', async (req, res) => {
    const projet = await projetRepository.getProjetById(req.params.id);
    if( projet === 0 ){
        res.status(404).json({ error: 'Projet non trouvé' });
    }
    else{
        res.json(projet);
    }
});

// Récupérer les projets par ID utilisateur
router.get('/getMine/:id_user', async (req, res) => {
    const projets = await projetRepository.getProjetsByUserId(req.params.id_user);
    res.json(projets);
});


// Route pour récupérer tous les projets avec un id_user différent de celui fourni
router.get('/getOther/:id_user', async (req, res) => {
    const { id_user } = req.params;

    const projets = await projetRepository.getProjetsDifferentUser(req.params.id_user);

    if (projets.length > 0) {
        res.status(200).json(projets);
    } else {
        res.status(404).json({ message: `Aucun projet trouvé avec un id_user différent de ${id_user}.` });
    }
});

// Route pour récupérer tous les projets suivit
router.get('/getSuivit/:id_user', async (req, res) => {
    const { id_user } = req.params;

    const projets = await projetRepository.getProjetsSuivit(req.params.id_user);
   console.log(projets)
    if (projets == 100) {
        res.status(404).json({ message: `Aucun projet suivit trouvé avec un id_user  de ${id_user}.` });

    } else {
        res.status(200).json(projets);
    }
});


exports.initializeRoutesProjet = () => router;
