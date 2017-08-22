import * as Bluebird from 'bluebird';
import {Rezult} from '../../common/message/rezult';
import * as util from 'util';
import {ErrorName} from '../message/errorName';

export type validator = keyof DbValidationService;

export class DbValidationService {

  public key = (str: any, len: number = 40): Rezult | null => {
    const valid = str && str.match(new RegExp('^[a-zA-Z][a-zA-Z_\\d]{1,' + (len - 1) + '}$'));
    // console.log(`=> dbValidation-service:8 valid ${util.inspect(valid)}`)
    if (!valid) {
      return new Rezult(ErrorName.db_invalidKey, {key: str} );
    }
    return null;
  }

  public digit = (str: any, len: number = 10): Rezult | null => {
    const valid = !!str.match(new RegExp('^\d{0,' + (len - 1) + '}$'));
    if (!valid) {
      return new Rezult(ErrorName.db_invalidDigit, {key: str} );
    }
    return null;
  }

  public int = (value: any, min: number = 0, max?: number ): Rezult | null => {
    if (!Number.isSafeInteger(value)) {
      return new Rezult(ErrorName.field_invalidNumber, {value: value});
    }
    if (value < min) {
      return new Rezult(ErrorName.field_numberTooSmall, {value: value, min: min});
    }
    return null;
  }

  public email = (value: any, min: number = 0, max?: number ): Rezult | null => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(value)) {
      return new Rezult(ErrorName.field_invalidEmail, {value: value});
    }
  }

  public phone = (value: any, min: number = 0, max?: number ): Rezult | null => {
    var re = /\d[\d-\s]{4,20}/;
    if (!re.test(value)) {
      return new Rezult(ErrorName.field_invalidEmail, {value: value});
    }
  }

}

export const dbValidationService: DbValidationService = new DbValidationService();


