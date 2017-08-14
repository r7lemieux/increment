"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_db_1 = require("./id-db");
const Prom = require("bluebird");
const config = require('./id-config.json');
const defaultIncrementSize = 500;
class IdService {
    constructor() {
        this.incrementUrl = 'https://kskxxtoe6c.execute-api.us-east-1.amazonaws.com/prod/incr2?counter=';
        this.tables = {};
        this.incrementSize = config ? config.incrementSize : defaultIncrementSize;
    }
    generateId(key) {
        return new Prom((resolve, reject) => {
            const cb = (val) => {
                resolve(val);
            };
            if (!this.tables[key]) {
                this.tables[key] = { tasks: [], active: false };
            }
            const table = this.tables[key];
            const task = { key, cb };
            table.tasks.push(task);
            return this.poke(key);
        });
    }
    removeKey(key) {
        return id_db_1.idDb.removeKey(key);
    }
    poke(key) {
        const table = this.tables[key];
        if (!table.active && table.tasks.length) {
            table.active = true;
            const task = table.tasks.shift();
            return this.increment(task.key)
                .then(res => {
                task.cb(res);
                table.active = false;
                return this.poke(key);
            });
        }
        else {
            return Prom.resolve();
        }
    }
    increment(key) {
        let val = 0;
        return id_db_1.idDb.incrementId(key, this.incrementSize);
    }
    getAllocatedRanges(name) {
        return id_db_1.idDb.getAllocatedRanges(name);
    }
}
exports.IdService = IdService;
exports.idService = new IdService();
//# sourceMappingURL=id-service.js.map