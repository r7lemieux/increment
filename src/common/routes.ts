import {idRoutes} from '../id/id-routes';
import {authRoutes} from '../auth/auth-routes';
import {userRoutes} from '../user/user-routes';

export = (app) => {
  idRoutes(app);
  userRoutes(app);
  authRoutes(app);
};
