import { Observable } from 'rxjs';
/**
 * @license Angular v0.0.1
 * (c) 2022-2023 Mor Diaw.
 * License: MIT
 *
 * Interaction avec l'Application Angular
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JRequest } from './jrequest';
import { JConnectivityService } from '../jnetwork/connectivity.service';
import { from, map, of } from 'rxjs';
import { LocalDBService } from '../local_db/local-db.service';
import { NetworkService } from '../jnetwork/network.service';
export const MARKER = 'joffline';

@Injectable({
  providedIn: 'root',
})
export class JHttp {
  constructor(private _network: NetworkService) {}

  /**
   *
   * @param url string
   * @param options options
   * @returns Observation<any>
   */
  get(url: string, options?: any): Observable<any> {
    return this._network.client.get(url, options);
  }

  /**
   * @param url string
   * @param data any 
   * @param options options
   * @returns Observation<any>
   */

  post(url: string, data: any, options?: any): Observable<any> {
    return this._network.client.post(url, data, options);
  }
}
