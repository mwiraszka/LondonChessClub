import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  isNewVersionAvailable$ = this.swUpdate.versionUpdates.pipe(
    map((versionEvent) => versionEvent.type !== 'NO_NEW_VERSION_DETECTED')
  );

  constructor(private swUpdate: SwUpdate) {}
}
