import * as _ from 'lodash';

interface MoClass { new() : Mo }

export class Mo {

  hydrate(partial: Partial<Mo>) {
    _.assign(this, partial);
  }

}
