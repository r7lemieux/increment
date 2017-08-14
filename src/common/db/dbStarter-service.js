"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_db_1 = require("../../id/id-db");
const Pool = require("pg-pool");
const util = require('util');
const pg = require('pg');
const NativeClient = pg.native.Client;
const Prom = require('bluebird');
let pool = null;
const connectDatabase = () => {
    const config = {
        user: 'r7lemieux',
        database: 'kdr',
        password: 'q12waq12',
        host: 'localhost',
        port: 5510,
        max: 10,
        application_name: 'IdManager',
        idleTimeoutMillis: 30000,
    };
    const pool = new Pool(config);
    pool.on('error', function (error, client) {
        console.log(`=> dbService:37 error ${util.inspect(error)}`);
    });
    return pool;
};
const testDatabase = (database) => {
    const res1 = database.raw('SELECT * FROM increment.newTable1')
        .then(res2 => {
        console.log(`=> dbService:26 res2 ${util.inspect(res2)}`);
        return database;
    })
        .catch(err => {
        console.log(`=> dbService:30 err ${util.inspect(err)}`);
        return database;
    });
};
const testDatabase2 = (pool) => {
    console.log(`=> dbService:54 `);
    pool.connect()
        .then(database => database.query('select * from idmanager.next_ids', [])
        .then(result => {
        database.release();
        console.log(`=> dbService:65 result.rows[0] ${util.inspect(result.rows[0])}`);
    })
        .catch(database.release))
        .catch(err => console.log(`=> dbService:63 err ${util.inspect(err)}`));
};
const createNextIdsTable = () => {
    pool.query(`CREATE TABLE IF NOT EXISTS next_ids (
      name      VARCHAR(40) PRIMARY KEY,
      next_id   INT DEFAULT 1001,
      increment INT DEFAULT 1000,
      mod_time  timestamp DEFAULT current_timestamp
  );`);
};
const createIdRangesTable = () => {
    pool.query(`CREATE TABLE IF NOT EXISTS id_ranges (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR (40),
      range_start INT,
      range_end   INT,
      create_time TIMESTAMP DEFAULT current_timestamp
    );`);
};
const rollback = (client, done) => {
    client.query('ROLLBACK', err => done(err));
    return Prom.reject();
};
const init = () => {
    pool = connectDatabase();
    pool.query("ALTER DATABASE kdr set search_path='idmanager'");
    id_db_1.idDb.init(pool);
    id_db_1.idDb.createTables();
};
exports.init = init;
exports.pool = pool;
exports.rollback = rollback;
//# sourceMappingURL=dbStarter-service.js.map