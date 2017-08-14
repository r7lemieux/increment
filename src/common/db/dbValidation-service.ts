import * as Bluebird from 'bluebird';
import {Error} from '../../common/message/error';
import * as util from 'util';

export class DbValidationService {

  public validateKey = (str: string, len: number = 40): Error | null => {
    const valid = str && str.match(new RegExp('^[a-zA-Z][a-zA-Z_\\d]{1,' + (len - 1) + '}$'));
    // console.log(`=> dbValidation-service:8 valid ${util.inspect(valid)}`)
    if (!valid) {
      return new Error('InvalidKey', {key: str} );
    }
    return null;
  }

  public validateDigit = (str: string, len: number = 10): Error | null => {
    const valid = !!str.match(new RegExp('^\d{0,' + (len - 1) + '}$'));
    if (!valid) {
      return new Error('validateDigit', {key: str} );
    }
    return null;
  }
}

export const dbValidationService: DbValidationService = new DbValidationService();


