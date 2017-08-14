import {idService} from "./id-service";
import {idController} from './id-controller';
// import {Application, Request, Response} from 'express';

export function idRoutes(app) {
  console.log(`=> id-routes:8 `);
  app.get('/api/id', (req, res) => {
    res.send('GET request to id route')
  });

  app.get('/api/generateId', (req , res) => {
    idController.generateId(req, res)
  });

  app.get('/api/allocatedRanges', (req , res) => {
    idController.getAllocatedRanges(req, res)
  });

  app.post('/', (req, res) => {
    res.send('POST request to id route')
  })

  app.get('/', (req, res) => {
    res.send('GET request to id route')
  })
}
