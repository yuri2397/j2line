import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SyncService } from '../sync/sync.service';

@Injectable({
  providedIn: 'root',
})
export class JConnectivityService  {
  private _isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);
  // isOnline
  isOnline: boolean = true;

  constructor(
    private _sync: SyncService
  ) {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
    this.isConnected.subscribe((isConnected) => {
      console.log("CONNEXION CHANGE:", isConnected);
      this.isOnline = isConnected;
      if(isConnected){
        this._sync.refreshLocalDB();
      }
    });
  }

  private updateOnlineStatus() {
    this._isConnected.next(navigator.onLine);
  }

  get isConnected (): Observable<boolean> {
    return this._isConnected.asObservable();
  }
}