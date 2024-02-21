import { Injectable } from '@angular/core';
import { JRequest } from '../jrequest/jrequest';
import { OnlineService } from './online.service';
import { OfflineService } from './offline.service';
import { JConnectivityService } from './connectivity.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(
    private _online: OnlineService,
    private _offline: OfflineService,
  ) {}

  get client(): JRequest {
    return navigator.onLine ? this._online : this._offline;
  }
}
