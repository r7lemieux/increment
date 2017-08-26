

import {Mo} from '../common/mo/mo';
import * as bcrypt from 'bcrypt-nodejs';

export class User extends Mo {

  id: number;
  username: string;

  password: string;
  email: string;

  facebookId: string;
  facebookToken: string;
  facebookEmail: string;
  facebookName: string;

  twitterId: string;
  twitterToken: string;
  twitterDisplayName: string;
  twitterUsername: string;

  googleId: string;
  googleToken: string;
  googleEmail: string;
  googleName: string;

  constructor(){
    super();
  }

  generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
  };

}
