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
import {MoDb} from './mo-db';

export class MoIncrementIdDb<MoClass> extends MoDb<MoClass> {


  constructor(moClass: MoClass, moName: string, tableName?: string) {
    super(moClass, moName, tableName);
  }

  protected getNextId = (): Prom<number> => {
    return dbIdGeneratorService.getNextId(this.tableName);
  }

  // SQL
  // ===


  protected buildFindOrCreateSql(id: number, key: string, value: string): string {
    return `
     WITH upsert AS (UPDATE ${this.tableName} SET id=${id} WHERE ${key}='${value}' RETURNING *)
    INSERT INTO ${this.tableName} (id, ${key}) SELECT 'id, ${key}' WHERE NOT EXISTS (SELECT * FROM upsert) 
    RETURNING *;
    `;
  }

  create(partialMo?: Partial<Mo>): Prom<Mo> {
    partialMo          = partialMo || {};
    return this.getNextId()
      .then(nextId => {
        partialMo['id'] = nextId;
        return super.create(partialMo);
      })
  }

  deleteWithId = (id: number):Prom<number> => {
    return this.pool.query(`DELETE FROM ${this.tableName} WHERE id = '${id}'`)
      .then( res => res.count);
  };

  findById = (id: number) => {
    return this.pool.query(`DELETE FROM ${this.tableName} WHERE id = '${id}'`);
  };

}

