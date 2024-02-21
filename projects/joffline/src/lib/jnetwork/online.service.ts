import { Injectable } from '@angular/core';
import { JRequest } from '../jrequest/jrequest';
import {
  HttpHeaders,
  HttpContext,
  HttpParams,
  HttpClient,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LocalDBService } from '../local_db/local-db.service';

@Injectable({
  providedIn: 'root',
})
export class OnlineService extends JRequest {
  override get isSynchronized(): boolean {
    return true;
  }
  public override post(url: string, body: any, options?: any): Observable<any> {
    return this._client.post(url, body, options);
  }
  public override get(url: string, options?: any): Observable<any> {
    console.log("GET FROM ONLINE");
    return this._client.get(url, options).pipe(
      map((response) => {
        console.log('UPDATE LOCAL DATA', response);
        this._storage.add(
          url,
          options?.headers,
          null,
          response,
          'GET'
        );
        return response;
      })
    );
  }
  public override delete(url: string, options: any): Observable<any> {
    return this._client.delete(url, options);
  }
  public override put(url: string, body: any, options?: any): Observable<any> {
    return this._client.put(url, body, options);
  }

  constructor(private _client: HttpClient, private _storage: LocalDBService) {
    super();
  }
}
