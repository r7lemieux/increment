import {idRoutes} from '../id/id-routes';
import {authRoutes} from '../auth/auth-routes';

export = (app) => {
  idRoutes(app);
  authRoutes(app);
};
