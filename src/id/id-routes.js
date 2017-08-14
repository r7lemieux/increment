"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_controller_1 = require("./id-controller");
function idRoutes(app) {
    console.log(`=> id-routes:8 `);
    app.get('/api/id', (req, res) => {
        res.send('GET request to id route');
    });
    app.get('/api/generateId', (req, res) => {
        id_controller_1.idController.generateId(req, res);
    });
    app.get('/api/allocatedRanges', (req, res) => {
        id_controller_1.idController.getAllocatedRanges(req, res);
    });
    app.post('/', (req, res) => {
        res.send('POST request to id route');
    });
    app.get('/', (req, res) => {
        res.send('GET request to id route');
    });
}
exports.idRoutes = idRoutes;
//# sourceMappingURL=id-routes.js.map