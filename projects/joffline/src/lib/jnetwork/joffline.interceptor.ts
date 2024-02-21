import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JOfflineInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const reqCopy = req.clone()
    // console.log(req.headers.get('joffline'));

    return next.handle(req);
  }
}


// https://www.scaler.com/topics/angular/angular-interceptor/