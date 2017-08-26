import * as util from 'util';
import * as Prom from 'bluebird';
import {User} from './user';
import {MoDb} from "../common/db/mo-db";
import {MoIncrementIdDb} from '../common/db/moIncrementId-db';

export class UserDb extends MoIncrementIdDb<User> {

  protected pool;

  constructor(userClass) {
    super(userClass, 'users');
  }

  // SQL
  // ===

  protected buildCreateTableSql = (): string => {
    return `CREATE TABLE IF NOT EXISTS users (
      id                 INT         PRIMARY KEY,
      username           VARCHAR(40) UNIQUE,
      email              VARCHAR(40) UNIQUE,      
      password           VARCHAR(80),
      salt               VARCHAR(40),
      facebookId         VARCHAR(40) UNIQUE,      
      facebookToken      VARCHAR(40),      
      facebookEmail      VARCHAR(40) UNIQUE,      
      facebookName       VARCHAR(40),  
      twitterId          VARCHAR(40) UNIQUE,      
      twitterToken       VARCHAR(40),      
      twitterUsername    VARCHAR(40) UNIQUE,      
      twitterDisplayName VARCHAR(40), 
      googleId           VARCHAR(40) UNIQUE,      
      googleToken        VARCHAR(40),      
      googleEmail        VARCHAR(40) UNIQUE,      
      googleName         VARCHAR(40),     
      mod_time           timestamp   DEFAULT current_timestamp
    );`
  }

  protected buildWhereClause(partialMo): string {
    return `username = '${partialMo.username}'`;
  }
}

export const userDb: UserDb = new UserDb(User);
