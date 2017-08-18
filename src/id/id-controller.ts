import {Request, Response} from 'express';
import {idService} from './id-service';
import {dbValidationService} from '../common/db/dbValidation-service';
import {Result} from '../common/message/result';

type IdRequestTask = {
  key: string,
  res: Response
}

export class IdController {

  constructor() {
  }

  generateId(req: Request, res: Response): void {
    const key = req.query.key;
    if (!this.validParams(req, res)) return;

    idService.generateId(key).then(newIdRange => {
      res.status(201);
      res.send(newIdRange);
    })
  }

  getAllocatedRanges(req: Request, res: Response): void {
    const key = req.query.key;
    if (!this.validParams(req, res)) return;

    idService.getAllocatedRanges(key)
      .then( allocatedRange => {
        res.jsonp(allocatedRange)
      });
  }

  validParams(req: Request, res: Response): boolean {
    const error = dbValidationService.validateKey(req.query.key);
    if (error) {
      res.status(400);
      res.send(error);
      return false;
    }
    return true;
  }
}

export const idController: IdController = new IdController();
