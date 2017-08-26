import * as util from 'util';
import * as Prom from 'bluebird';
import {dbIdGeneratorService} from './dbIdGenerator-service';
import {Type} from 'typescript';
import {Client, QueryResult} from 'pg';
import {Mo} from '../mo/mo';
import {Rezult} from "../message/rezult";
import {User} from '../../user/user';
import * as _ from "lodash";
import {ErrorName} from '../message/errorName';

export class MoDb<MoClass> {

  protected pool;
  protected moName: string;
  protected tableName: string;
  protected moClass: any;

  constructor(moClass: MoClass, moName: string, tableName?: string) {
    this.moName    = moName;
    this.tableName = tableName || moName;
    this.moClass   = moClass;
  }

  init(pool) {
    this.pool = pool;
  }

  // SQL
  // ===

  protected buildCreateTableSql = (): string => {
    return '';
  }

  protected buildInsertSql = (moPartial: any): string => {
    const fieldnames = Object.keys(moPartial);
    const values     = fieldnames.map(fieldname => {
      let val = moPartial[fieldname];
      if ((typeof val) === 'string') {
        val = "'" + val + "'";
      }
      return val
    }).join(', ');
    const sqlText    = `INSERT INTO ${this.tableName} (${fieldnames.join(', ')}) VALUES (${values})`;
    return sqlText;
  }

  protected buildUpdateSql = (partialMo: any): string => {
    const fieldnames   = Object.keys(partialMo);
    const fieldUpdates = fieldnames.map(fieldname => {
      let val = partialMo[fieldname];
      if ((typeof val) === 'string') {
        val = "'" + val + "'";
      }
      return `${fieldname} = ${val}`;
    }).join(', ');
    const whereClause = this.buildWhereClause(partialMo);
    const sqlText    = `UPDATE ${this.tableName} SET ${fieldUpdates} WHERE ${whereClause};`;
    return sqlText;
  }

  protected buildWhereClause(partialMo): string {
    return `id = ${partialMo.id}`;
  }

  protected buildDeleteSql = (id: number) => {
    return `DELETE FROM ${this.tableName} WHERE id = '${id}'`
  }

  protected buildSelectBySql(fieldname: string, fieldValue: any) {
    return ` SELECT * FROM ${this.tableName} WHERE ${fieldname} = '${fieldValue}'`
  }

  protected buildSelectSql(partialMo: Partial<Mo>): string {
    const fieldnames   = Object.keys(partialMo);
    const whereClauses = fieldnames.map(fieldname => {
      let val = (partialMo as {})[fieldname];
      if ((typeof val) === 'string') {
        val = "'" + val + "'";
      }
      return `${fieldname}=${val}`
    }).join(' AND ');
    return `SELECT * FROM ${this.tableName} WHERE ${whereClauses}`;
  }

  protected buildFindOrCreateSql(id: number, key: string, value: string): string {
    return `
     WITH upsert AS (UPDATE ${this.tableName} SET id=${id} WHERE ${key}='${value}' RETURNING *)
    INSERT INTO ${this.tableName} (id, ${key}) SELECT 'id, ${key}' WHERE NOT EXISTS (SELECT * FROM upsert) 
    RETURNING *;
    `;
  }

  createTables() {
    this.createTable();
  }

  acreateTable() {
    let client: Client;
    return this.pool.connect()
      .then(pooledClient => {
        client = pooledClient
        return client.query(this.buildCreateTableSql());
      })
      .then(client.release);
  }

  async createTable() {
    const client = await this.pool.connect()
    await client.query(this.buildCreateTableSql());
    client.release()
  }

  create(partialMo?: Partial<Mo>): Prom<Mo> {
    partialMo          = partialMo || {};
        return this.pool.query(this.buildInsertSql(partialMo))
      .then((res: QueryResult) => {
        if (res.rowCount === 1) {
          const mo = Object.create(this.moClass.prototype);
          mo.hydrate(partialMo);
          return mo;
        }
        throw new Rezult(ErrorName.db_FailToCreate);
      })
  }

  update(partialMo?: any): Prom<Partial<Mo>> {
    partialMo          = partialMo || {};
        return this.pool.query(this.buildUpdateSql(partialMo))
      .then((res: QueryResult) => {
        if (res.rowCount === 1) {
          const mo = Object.create(this.moClass.prototype);
          mo.hydrate(partialMo);
          return mo;
        }
        throw new Rezult(ErrorName.db_FailToUpdate);
      })
  }

  deleteAll = ():Prom<number> => {
    return this.pool.query(`DELETE FROM ${this.tableName}`)
      .then(res => {
        return res.count
      })
      .catch(err => {
        console.log(`=> mo-db:160 err ${util.inspect(err)}`)
      });
  };

  find = (partialMo: Partial<Mo>): Prom<Mo[]> => {
    return this.pool.query(this.buildSelectSql(partialMo));
  };

  findSingle = (partialMo: Partial<Mo>): Prom<Mo> => {
    return this.pool.query(this.buildSelectSql(partialMo))
      .then(res => {
        if (res.rows.length > 1) {
          throw (new Rezult(ErrorName.db_SingleReturnsMultiple, {table: this.tableName, partialMo: partialMo}));
        } else if (res.rows.length === 0) {
          return null;
        } else {
          const moData: Partial<Mo> = res.rows[0];
          const mo = Object.create(this.moClass.prototype);
          mo.hydrate(moData);
          return mo;
        }
      });
  };

  protected rollback(client, done) {
    return client.query('ROLLBACK');
  }
}

