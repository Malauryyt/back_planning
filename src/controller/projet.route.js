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
app.delete('/projet/:id', async (req, res) => {
    const success = await projetController.deleteProjet(req.params.id);
    success ? res.json({ message: 'Projet supprimé' }) : res.status(404).json({ error: 'Projet non trouvé' });
});

// Récupérer un projet par ID
app.get('/projet/:id', async (req, res) => {
    const projet = await projetController.getProjetById(req.params.id);
    projet ? res.json(projet) : res.status(404).json({ error: 'Projet non trouvé' });
});

// Récupérer les projets par ID utilisateur
app.get('/projets/user/:id_user', async (req, res) => {
    const projets = await projetController.getProjetsByUserId(req.params.id_user);
    res.json(projets);
});



// Route pour récupérer tous les projets avec un id_user différent de celui fourni
router.get('/getAutreProject/:id_user', async (req, res) => {
    const { id_user } = req.params;

    const projets = await projetRepository.getProjetsDifferentUser(req.params.id_user);

    if (projets.length > 0) {
        res.status(200).json(projets);
    } else {
        res.status(404).json({ message: `Aucun projet trouvé avec un id_user différent de ${id_user}.` });
    }
});

exports.initializeRoutesProjet = () => router;
