import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalDBService } from '../local_db/local-db.service';
import { firstValueFrom, from } from 'rxjs';
import { JConnectivityService } from '../jnetwork/connectivity.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
    private _httpClient: HttpClient,
    private _storage: LocalDBService,
    private _connectivity: JConnectivityService
  ) {
    _connectivity.isConnected.subscribe((isOnline) => {
      if (isOnline) {
        this.refreshLocalDB();
      }
    });
  }

  /**
   * Effectue les opérations de synchronisation nécessaires entre l'application et le backend.
   */
  public synchronize(): void {}

  /**
   * Rafraîchit la base de données locale en récupérant les données du backend.
   */
  public refreshLocalDB() {
    var gestResponse = from(this._storage.findAllByMethod('GET'));

    gestResponse.subscribe(
      async (requests: any[]) => {
        await Promise.all(
          requests.map(async (request) => {
            try {
              var response = await firstValueFrom(
                this._httpClient.get(request.url, request.options)
              );
              await this._storage.update(request.url, request.method, response);
            } catch (error) {
              // Gérer l'erreur pour une requête spécifique
              console.error(
                `Erreur lors de la synchronisation de ${request.url} :`,
                error
              );
              console.log("Bonjour tout le monde;");
            }
          })
        );
      },
      // Gérer l'erreur globale ici si nécessaire
      (error) => {
        console.error(
          'Erreur lors de la récupération des requêtes locales :',
          error
        );
      }
    );
  }
}
