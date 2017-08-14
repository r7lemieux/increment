"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_service_1 = require("./id-service");
const dbValidation_service_1 = require("../common/db/dbValidation-service");
class IdController {
    constructor() {
    }
    generateId(req, res) {
        const key = req.query.key;
        if (!this.validParams(req, res))
            return;
        id_service_1.idService.generateId(key).then(newIdRange => {
            res.status(201);
            res.send(newIdRange);
        });
    }
    getAllocatedRanges(req, res) {
        const key = req.query.key;
        if (!this.validParams(req, res))
            return;
        id_service_1.idService.getAllocatedRanges(key)
            .then(allocatedRange => {
            res.jsonp(allocatedRange);
        });
    }
    validParams(req, res) {
        const error = dbValidation_service_1.dbValidationService.validateKey(req.query.key);
        if (error) {
            res.status(400);
            res.send(error);
            return false;
        }
        return true;
    }
}
exports.IdController = IdController;
exports.idController = new IdController();
//# sourceMappingURL=id-controller.js.map