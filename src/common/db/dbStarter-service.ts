import {userDb} from '../../user/user-db';
import * as Prom from 'bluebird';
declare function require(name: string);

declare const console;

import {dbManagers} from './db-index';
import * as ddd from './db-index';
import {Pool, PoolConfig} from 'pg';

const util         = require('util');
const pg           = require('pg');
const NativeClient = pg.native.Client;

// Prom.promisifyAll(Pool);
export class DbStarter {
  pool: Pool = null;
  poolConfig: PoolConfig;

  constructor() {
    this.poolConfig = {
      user             : 'r7lemieux',
      database         : 'kdr',
      password         : 'q12waq12',
      host             : 'localhost',
      port             : 5510,
      max              : 10,
      application_name : 'IdManager',
      idleTimeoutMillis: 30000,

      // Client: NativeClient,
    }
  }

// const connectDatabaseRaw = (knex) => {
//   const client = new pg.Client({
//     host: '127.0.0.1',
//     user: 'r7lemieux',
//     password: 'q12waq12',
//   });
//   client.query('USE increment; SELECT * FROM newTable1',
//     function (err, rows) {
//       if (err)
//         throw err;
//       console.dir(rows);
//     });
//   client.end();
//   return client;
// };

  connectDatabase = () => {
    this.pool = new Pool(this.poolConfig);
    this.pool.on('error', function (error, client) {
      console.log(`=> dbService:37 error ${util.inspect(error)}`)
    })
  };

  initDatabase = () => {
    this.connectDatabase();
    // pool.query('CREATE SCHEMA IF NOT EXISTS idmanager AUTHORIZATION r7lemieux');

    this.pool.query("ALTER DATABASE kdr set search_path='idmanager'");
    dbManagers.forEach(dbManager => {
      dbManager.init(this.pool);
    });
    return Prom.map(dbManagers, (dbManager => dbManager.createTables()));
    // testDatabase2(pool);
    // const database = connectDatabase(knex);
    // database.raw('SET search_path TO \'idmanager\';')
    //   .then(() => database)
    //   .then(testDatabase)
    //   .then(() => nextId.createTable(database))
    //   .finally(database.close);
  };

  ensureInitDatabase = (): Prom<any> => {
    if (!this.pool) {
      return this.initDatabase();
    }
    return Prom.resolve();
  }
}

export const dbStarter: DbStarter = new DbStarter();
