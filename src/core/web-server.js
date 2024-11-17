const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const {sequelize} = require("../datamodel/db")

const User = require('../datamodel/utilisateur.model');
const Projet = require('../datamodel/projet.model');
const Tache = require('../datamodel/taches.model');
const Jalon = require('../datamodel/jalon.model');

const routesUser = require('../controller/user.route');
const RoutesProjet = require('../controller/projet.route');
const RoutesJalon = require('../controller/jalon.route');


class WebServer {
    app = undefined;
    port = process.env.PORT;
    server = undefined;


    constructor() {
        this.app = express();
        sequelize.sync({alter: true});

        Projet.belongsTo(User, {foreignKey: "id_user"});

        Jalon.belongsTo(Projet,{foreignKey: "id_projet"} );
        Jalon.belongsTo(User,{foreignKey: "id_user"} );

        Tache.belongsTo(Jalon, {foreignKey: "id_jalon"});
        Tache.belongsTo(User, {foreignKey: "id_user"});
        Tache.belongsTo(Projet, {foreignKey: "id_projet"});
        Tache.belongsTo(Tache, {foreignKey: "id"});


        require('dotenv').config();
        initializeConfigMiddlewares(this.app);
        this._initializeRoutes();
        initializeErrorMiddlwares(this.app);
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }

    stop() {
        this.server.close();
    }

    _initializeRoutes() {
        this.app.use('/user', routesUser.initializeRoutesUser());
        this.app.use('/projet', RoutesProjet.initializeRoutesProjet());
        this.app.use('/jalon', RoutesJalon.initializeRoutesJalon());

    }
}

module.exports = WebServer;



