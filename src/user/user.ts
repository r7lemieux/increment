

import {Mo} from '../common/mo/mo';

export class User extends Mo {

  id: number;
  username: string;
  password: string;
  email: string;
  facebookId: string;

  constructor(){
    super();
  }

  // hydrate(partialUser) {
  //   this.id = partialUser.id;
  //   this.username = partialUser.username;
  //   this.password = partialUser.password;
  //   this.email = partialUser.email;
  //   this.facebookId = partialUser.facebookId;
  // }
}
