
import {ErrorName} from './errorName';

export type RezultStatus = 'message' | 'error';

export class Rezult extends Error {

  public status: RezultStatus;
  public data: any;

  constructor( errorName:ErrorName = ErrorName.ok, data?:any) {
    super();
    this.setName(errorName);
    this.data = data;
  }

  setName = (errorName: ErrorName) => {
    this.name = ErrorName[errorName];
  }

}

