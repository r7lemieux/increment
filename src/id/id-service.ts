import {idDb} from './id-db';
import * as Prom from 'bluebird';
const config = require('./id-config.json');
const defaultIncrementSize = 500;

type IdRequestTask = {
  key: string,
  cb: (string) => void
}
export class IdService {

  protected incrementUrl: string = 'https://kskxxtoe6c.execute-api.us-east-1.amazonaws.com/prod/incr2?counter=';
  protected tables: {[tableName:string]: { tasks: IdRequestTask[], active: boolean}};
  protected incrementSize: number;
  constructor() {
    this.tables = {};
    this.incrementSize = config ? config.incrementSize : defaultIncrementSize;
  }


    generateId(key: string): Prom<any> {
    return new Prom((resolve, reject) => {
      const cb = (val) => {
        resolve(val);
      }
      if (!this.tables[key]) {
        this.tables[key] = {tasks: [], active: false};
      }
      const table = this.tables[key];
      const task: IdRequestTask = {key, cb};
      table.tasks.push(task);
      return this.poke(key);
    });
  }

  removeKey(key: string): Prom<any> {
    return idDb.removeKey(key);
  }

  poke(key: string): Prom<any> {
    const table = this.tables[key];
    if (!table.active && table.tasks.length) {
      table.active = true;
      const task = table.tasks.shift();
      return this.getNextIdRange(task.key)
        .then( res => {
          task.cb(res);
          table.active = false;
          return this.poke(key);
        });
    } else {
      return Prom.resolve(); // for testing
    }
  }

  getNextIdRange(key: string): Prom<any> {
    return idDb.getNextIdRange(key, this.incrementSize);
  }

  getAllocatedRanges(name: string) {
    return idDb.getAllocatedRanges(name);
  }
}

export const idService: IdService = new IdService();
