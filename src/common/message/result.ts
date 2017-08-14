
export type ResultStatus = 'message' | 'error';

export class Result {

  public status: ResultStatus;
  public code: string;
  public data: any;

  constructor( status: ResultStatus, code:string, data?:any) {
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

