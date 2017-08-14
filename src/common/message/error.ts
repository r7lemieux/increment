import {Result} from './result';

export class Error extends Result {

  constructor(code: string, data?: any) {
    super('error', code, data);
  }
}

