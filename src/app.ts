import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as knex from 'knex';

import {idRoutes} from './id/id-routes';

const dbStarter = require('./common/db/dbStarterService');
const port = 4010;

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    dbStarter.init(knex);

    this.express.listen(port, () => {
      console.log('kdr listening on port ' + port);
    });

  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    let router = express.Router();
    this.express.use('/', router);
    idRoutes(this.express);
  }

}

export const app = new App();
export default app.express;
