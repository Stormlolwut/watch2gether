import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { ToastController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    constructor(private router: Router, private toastController: ToastController, private storage: Storage) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return from(this.storage.get("ACCESS_TOKEN"))
            .pipe(
                switchMap(token => {
                    if (token) {
                        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
                    }

                    if (!request.headers.has('Content-Type')) {
                        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
                    }

                    return next.handle(request).pipe(
                        map((event: HttpEvent<any>) => {
                            if (event instanceof HttpResponse) {
                                // do nothing for now
                            }
                            return event;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            const status = error.status;
                            const reason = error && error.error.reason ? error.error.reason : '';
                            
                            this.router.navigate(['login']);

                            this.presentAlert(status, reason);
                            return throwError(error);
                        })
                    );
                })
            );
    }

    async presentAlert(status, reason) {
        const alert = await this.toastController.create({
            header: status + ' Error',
            message: reason,
            buttons: ['OK']
        });

        await alert.present();
    }
}