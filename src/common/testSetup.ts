import {dbStarter} from './db/dbStarter-service';
import * as Prom from 'bluebird';

export default (): Prom<any> => {
    global['testing'] = true;
    return dbStarter.ensureInitDatabase()
}
