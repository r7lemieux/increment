import {Mo} from '../mo/mo';
import {MoDb} from '../db/mo-db';
import * as Prom from 'bluebird';
import {Rezult} from '../message/rezult';
import {ErrorName} from '../message/errorName';
import {dbValidationService, DbValidationService, validator} from '../db/dbValidation-service';

export class MoService<MoClass> {

  public moClass: MoClass;
  public moDb: MoDb<MoClass>;

  constructor(moClass: MoClass, moDb: MoDb<MoClass>) {
    this.moClass = moClass;
    this.moDb    = moDb;
  }

  create(partialUser: Partial<MoClass>): Prom<Mo> {
    return this.moDb.create(partialUser);
  }

  deleteAll = (): Prom<any> => {
    return this.moDb.deleteAll();
  }

  findSingle(partialMo: Partial<Mo>): Prom<Mo> {
    return this.moDb.findSingle(partialMo)
  }

  testField(partial: Partial<Mo>, fieldname: string, testName: keyof DbValidationService, ...args ): Rezult | null {
    let rezult: Rezult = null;
    const value: any        = partial[fieldname];
    if (value !== undefined) {
      rezult = dbValidationService[testName](value, ...args);
    }
    return rezult;
  }

  buildTestField = (partialMo: Partial<Mo>, rezults: Rezult[]) => {
    return (fieldname: string, testName: validator, ...args) => {
      const fieldRezult = this.testField(partialMo, fieldname, testName, ...args);
      if (fieldRezult) {
        rezults.push(fieldRezult);
      }
    };
  }
}
