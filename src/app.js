"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const knex = require("knex");
const id_routes_1 = require("./id/id-routes");
const dbStarter = require('./common/db/dbStarterService');
const port = 4010;
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        dbStarter.init(knex);
        this.express.listen(port, () => {
            console.log('kdr listening on port ' + port);
        });
    }
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    routes() {
        let router = express.Router();
        this.express.use('/', router);
        id_routes_1.idRoutes(this.express);
    }
}
exports.app = new App();
exports.default = exports.app.express;
//# sourceMappingURL=app.js.map