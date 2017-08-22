import {Rezult} from '../message/rezult';

export interface callback {
  (err:any, rezult?:any)
}

export interface kcallback {
  (rezult:Rezult)
}
