import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JHttp } from 'joffline';
import { Product } from './models/product';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'build_package';
  data: Product[] = [];
  constructor(private offlineHttp: JHttp, private http: HttpClient) {
    this.fetProducts();
  }
  ngOnInit(): void {}

  fetProducts() {
    this.offlineHttp
      .get('https://fakestoreapi.com/products')
      .pipe(
        catchError((e: any) => {
          console.log(e);
          throw e;
        })
      )
      .subscribe((data: Product[]) => {});
  }

  storeProduct() {
    this.http
      .post('https://fakestoreapi.com/products', {
        title: 'Sac Main Femme',
        price: 13,
        description: 'Sac Main Femme',
        category: 'jewelery',
        image:
          'https://img.freepik.com/photos-gratuite/belle-elegance-mode-luxe-sac-main-femme-rose_1203-7653.jpg',
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.fetProducts();
        },
      });
  }

  search(data: any) {}
}
