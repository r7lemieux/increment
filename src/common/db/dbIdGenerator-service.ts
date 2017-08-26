import * as http from 'http';
import * as Prom from 'bluebird';
import {idService} from '../../globalId/id-service';

declare interface IdState {
  nextId: number
  from: number,
  to: number,
}

export class DbIdGeneratorService {

  private idServer: {
    hostname: string,
    port: string,
    path: string
  };

  private idStates: Map<string, IdState>

  constructor() {
    this.idServer = {
      hostname: '127.0.0.1',
      port    : '4010',
      path    : 'api/generatedId?key=',
    };
    this.idStates = new Map<string, IdState>();
  }

  getNextId(key: string): Prom<number> {
    let idState: IdState = this.idStates.get(key);
    if (!idState) {
      idState            = {nextId: 1, from: -1, to: -1};
      this.idStates[key] = idState;
    }
    const nextId = idState.nextId;

    return new Prom((resolve, reject) => {
        if (idState.nextId > idState.to) {
          if (global['testing']) {
            return idService.getNextIdRange(key)
              .then(newRange => {
                this.hydrateIdState(idState, newRange);
                resolve(nextId);
              });
          }
          const req = http.request({
            hostname: this.idServer.hostname,
            port    : this.idServer.port,
            path    : this.idServer.path + key,
          });
          req.on('data', newRange => {
            this.hydrateIdState(idState, newRange);
            resolve(nextId);
          });
          req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            reject(e);
          });
        } else {
          idState.nextId++;
          resolve(idState.nextId);
        }
      setTimeout(() => {
         reject('timeout on getting range for ' + JSON.stringify(idState));
      }, 2000);
    });
  }

  protected hydrateIdState(idState, newRange) {
    idState.from   = newRange.from;
    idState.to     = newRange.to;
    idState.nextId = newRange.from;
    idState.nextId++;
  }
}

export const dbIdGeneratorService: DbIdGeneratorService = new DbIdGeneratorService();
