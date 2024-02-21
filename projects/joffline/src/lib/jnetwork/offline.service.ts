import { Injectable, inject } from '@angular/core';
import { JRequest } from '../jrequest/jrequest';
import { Observable, from, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocalDBService } from '../local_db/local-db.service';

@Injectable({
  providedIn: 'root',
})
export class OfflineService extends JRequest {
  override get isSynchronized(): boolean {
    return true;
  }
  public override post(url: string, body: any, options?: any): Observable<any> {
    return of([]);
  }
  public override get(url: string, options?: any): Observable<any> {
    return from(this._storage.findBy(url, 'GET'));
  }
  public override delete(url: string, options: any): Observable<any> {
    return of([]);
  }
  public override put(url: string, body: any, options?: any): Observable<any> {
    return of([]);
  }

  constructor(private _storage: LocalDBService) {
    super();
  }
}
