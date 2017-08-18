import * as util from 'util';
import * as Prom from 'bluebird';
import {User} from './user';
import {dbIdGeneratorService} from '../common/db/dbIdGenerator-service';

export class UserDb {

  protected pool;

  constructor() {
  }

  init(pool) {
    this.pool = pool;
  }

  createTables() {
    this.createUserTable();
  }

  createUserTable() {
    this.pool.query(`CREATE TABLE IF NOT EXISTS users (
      id         INT,
      username   VARCHAR(40) PRIMARY KEY,
      password   VARCHAR(40) PRIMARY KEY,
      salt       VARCHAR(40) PRIMARY KEY,
      email      VARCHAR(40) PRIMARY KEY,      
      facebookId VARCHAR(40) PRIMARY KEY,      
      mod_time   timestamp DEFAULT current_timestamp
  );`);
  }

  removeUser = (id: number) => {
    return this.pool.query(`DELETE FROM users WHERE id = '${id}'`);
  };

  buildSelectSqlByFaceboolId(facebookId:string) {
    return ` SELECT * FROM users WHERE facebookId = '${facebookId}'`
  }

  buildSelectSqlByUsername(username:string) {
    return ` SELECT * FROM users WHERE username = '${username}'`
  }

  buildSelectSql(key:string, value:string) {
    return ` SELECT * FROM users WHERE ${key} = '${value}'`
  }

  buildFindOrCreateOAuthSql(key: string, value: string): Prom<string> {
    let id: number;
    return dbIdGeneratorService.getNextId('users')
      .then(nextId => {
        id = nextId;
        return `
     WITH upsert AS (UPDATE users SET id=${id} WHERE ${key}='${value}' RETURNING *)
    INSERT INTO user (id, ${key}) SELECT 'id, ${key}' WHERE NOT EXISTS (SELECT * FROM upsert) 
    RETURNING *;
    `;
      });
  }

  findOrCreate(userParams: User): Prom<any> {
    let client   = null;
    let result   = null;
    let querySql;
    if (userParams.facebookId) {
      querySql = this.buildSelectSql('facebookId', userParams.facebookId);
    } else if (userParams.username) {
      querySql = this.buildSelectSql('username', userParams.username);
    }
    return this.pool.connect()
      .then(newClient => {
        client = newClient;
        return client.query('BEGIN');
      })
      .then(() => {
        return client.query(querySql, []);
      })
      .then(newResult => {
        result = newResult;
        return client.query('COMMIT');
      })
      .then(() => {
        if (!result.rows || !result.rows[0]) {
          return client.query('ROLLBACK', client.release);
        }
        const row = result.rows[0];
        client.release();
        return {from: row.range_start, to: row.range_end};
      })
      .catch(() => {
        return client.query('ROLLBACK', client.release)
          .then(rollbackResult => {
            return this.releaseClient(client);
          })
      })
  }

  getAllocatedRanges(name): Prom<any> {
    let client = null;
    return this.pool.connect()
      .then(newClient => {
        client = newClient;
        return client.query(`SELECT range_start, range_end from idmanager.id_ranges WHERE name = '${name}'`);
      })
      .then(result => {
        client.release();
        return (result.rows.map(row => [row.range_start, row.range_end]));
      })
      .catch(() => this.releaseClient(client))
  }

  protected releaseClient(client) {
    if (client) {
      client.release();
    }
  }

  protected rollback(client, done) {
    return client.query('ROLLBACK');
  }
}

export const userDb: UserDb = new UserDb();
