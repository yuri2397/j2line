import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalDBService {
 
  private dbName: string = window.location.hostname + '_joffline';
  private dbVersion: number = 1;
  private db?: IDBDatabase;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      this.db = (event.target as any).result;

      if (this.db) {
        this.db.onerror = (event: Event) => {
          console.error(
            "Erreur lors de l'initialisation de la base de données IndexedDB."
          );
        };

        // Créer la table request_tables
        if (!this.db?.objectStoreNames.contains('request_tables')) {
          const requestTable = this.db?.createObjectStore('request_tables', {
            keyPath: 'id',
            autoIncrement: true,
          });

          // Ajouter des index si nécessaire
          requestTable?.createIndex('url', 'url', { unique: false });
          requestTable?.createIndex('method', 'method', { unique: false });
        }
      }
    };

    request.onsuccess = (event: Event) => {
      this.db = (event.target as any).result;
      console.log('Base de données IndexedDB initialisée avec succès !');
    };

    request.onerror = (event: Event) => {
      console.error(
        "Erreur lors de l'initialisation de la base de données IndexedDB."
      );
    };
  }

  // Fonction pour insérer de nouvelles données dans la table request_tables
  add(
    url: string,
    headers: any,
    body: any,
    response: any,
    method: string
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      console.log('INSERT REQUEST');
      const transaction = this.db?.transaction(['request_tables'], 'readwrite');
      const requestTable = transaction?.objectStore('request_tables');

      // add if url and method not already exists or update if exists
      const request = requestTable?.index('url').get(url);

      request!.onsuccess = (event: Event) => {
        const request = (event.target as any).result;

        if (request && request.method === method && request.url === url ) {
          const updateRequest = requestTable?.put({
            id: request.id,
            url: url,
            headers: headers,
            body: body,
            response: response,
            method: method,
          });

          updateRequest!.onsuccess = (event: Event) => {
            const request = (event.target as any).result;
            resolve(request);
          };

          updateRequest!.onerror = (event: Event) => {
            console.error(
              'Erreur lors de la mise à jour de la requête dans la table request_tables.'
            );
            reject(event);
          };
        } else {
          const addRequest = requestTable?.add({
            url: url,
            headers: headers,
            body: body,
            response: response,
            method: method,
          });

          addRequest!.onsuccess = (event: Event) => {
            const request = (event.target as any).result;
            resolve(request);
          };

          addRequest!.onerror = (event: Event) => {
            console.error(
              'Erreur lors de l\'ajout de la requête dans la table request_tables.'
            );
            reject(event);
          };
        }
      };
    });
  }

  update(url: string,method: 'GET'|'PUT'|'POST'|'DELETE', response: any): Promise<boolean> {
      const transaction = this.db?.transaction(['request_tables'], 'readwrite');
      const requestTable = transaction?.objectStore('request_tables');
      
      return new Promise<boolean> ((resolve, reject) => {
        // get request by url and method
        const request = requestTable?.index('url').get(url);
        
        request!.onsuccess = (event: Event) => {
          const request = (event.target as any).result;
          if (request && request.method === method && request.url === url) {
            const updateRequest = requestTable?.put({
              id: request.id,
              url: url,
              headers: request.headers,
              body: request.body,
              response: response,
              method: method,
            });
            updateRequest!.onsuccess = (event: Event) => {
              const request = (event.target as any).result;
              resolve(true);
            };
            updateRequest!.onerror = (event: Event) => {
              console.error(
                'Erreur lors de la mise à jour de la requête dans la table request_tables.'
              );
              reject(false);
            };
          } else {
            reject(false);
          }
        };
      });
      
  }

  // find if request already exists with same url and method
  findBy(url: string, method: string): Promise<any> {
    console.log('FIND REQUEST FROM LOCAL DB');
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db?.transaction(['request_tables'], 'readonly');
      const requestTable = transaction?.objectStore('request_tables');

      const request = requestTable?.index('url').get(url);

      request!.onsuccess = (event: Event) => {
        const request = (event.target as any).result;

        if (request) {
          resolve(request.response);
        } else {
          reject(
            new HttpErrorResponse({ error: 'Request not found', status: 404 })
          );
        }
      };

      request!.onerror = (event: Event) => {
        console.error(
          'Erreur lors de la recherche de la requête dans la table request_tables.'
        );
        reject(event);
      };
    });
  }

  findAll() {
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db?.transaction(['request_tables'], 'readonly');
      const requestTable = transaction?.objectStore('request_tables');

      const request = requestTable?.getAll();

      request!.onsuccess = (event: Event) => {
        const request = (event.target as any).result;

        if (request) {
          resolve(request);
        } else {
          reject(
            new HttpErrorResponse({ error: 'Request not found', status: 404 })
          );
        }
      };

      request!.onerror = (event: Event) => {
        console.error(
          'Erreur lors de la recherche de la requête dans la table request_tables.'
        );
        reject(event);
      };
    });
  }

  // get the first request in the table request_tables
  getFirst(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db?.transaction(['request_tables'], 'readonly');
      const requestTable = transaction?.objectStore('request_tables');

      const request = requestTable?.openCursor();

      request!.onsuccess = (event: Event) => {
        const cursor = (event.target as any).result;

        if (cursor) {
          resolve(cursor.value);
        } else {
          reject(
            new HttpErrorResponse({ error: 'Request not found', status: 404 })
          );
        }
      };

      request!.onerror = (event: Event) => {
        console.error(
          'Erreur lors de la recherche de la requête dans la table request_tables.'
        );
        reject(event);
      };
    });
  }

  // count the number of requests in the table request_tables
  count(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const transaction = this.db?.transaction(['request_tables'], 'readonly');
      const requestTable = transaction?.objectStore('request_tables');

      const request = requestTable?.count();

      request!.onsuccess = (event: Event) => {
        const count = (event.target as any).result;

        if (count) {
          resolve(count);
        } else {
          reject(
            new HttpErrorResponse({ error: 'Request not found', status: 404 })
          );
        }
      };

      request!.onerror = (event: Event) => {
        console.error(
          'Erreur lors de la recherche de la requête dans la table request_tables.'
        );
        reject(event);
      };
    });
  }

  // delete a request from the table request_tables
  delete(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db?.transaction(['request_tables'], 'readwrite');
      const requestTable = transaction?.objectStore('request_tables');

      const request = requestTable?.delete(id);

      request!.onsuccess = (event: Event) => {
        const count = (event.target as any).result;

        if (count) {
          resolve(count);
        } else {
          reject(
            new HttpErrorResponse({ error: 'Request not found', status: 404 })
          );
        }
      };

      request!.onerror = (event: Event) => {
        console.error(
          'Erreur lors de la recherche de la requête dans la table request_tables.'
        );
        reject(event);
      };
    });
  }

  // find by method (GET, POST, PUT, DELETE)

  findAllByMethod(method: 'GET' | 'POST' | 'DELETE' | 'PUT'): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db?.transaction(['request_tables'], 'readonly');
      const requestTable = transaction?.objectStore('request_tables');

      const request = requestTable?.index('method').getAll(method);

      request!.onsuccess = (event: Event) => {
        const request = (event.target as any).result;

        if (request) {
          resolve(request);
        } else {
          reject(
            new HttpErrorResponse({ error: 'Request not found', status: 404 })
          );
        }
      };

      request!.onerror = (event: Event) => {
        console.error(
          'Erreur lors de la recherche de la requête dans la table request_tables.'
        );
        reject(event);
      };
    });
  }
}
