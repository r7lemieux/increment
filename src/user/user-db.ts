import * as util from 'util';
import * as Prom from 'bluebird';
import {User} from './user';
import {MoDb} from "../common/db/mo-db";

export class UserDb extends MoDb<User> {

  protected pool;

  constructor(userClass) {
    super(userClass, 'users');
  }

  // SQL
  // ===

  protected buildCreateTableSql = (): string => {
    return `CREATE TABLE IF NOT EXISTS users (
      id         INT PRIMARY KEY,
      username   VARCHAR(40) UNIQUE,
      password   VARCHAR(40),
      salt       VARCHAR(40),
      email      VARCHAR(40) UNIQUE,      
      facebookId VARCHAR(40) UNIQUE,      
      mod_time   timestamp DEFAULT current_timestamp
    );`
  }

}

export const userDb: UserDb = new UserDb(User);
