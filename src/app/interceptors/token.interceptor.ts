import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError, from} from 'rxjs';
import {map, catchError, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

import {ToastController} from '@ionic/angular';
import {environment} from '../../environments/environment';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private router: Router, private toastController: ToastController, private storage: Storage) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.url.startsWith(environment.serverURL)) {
            return next.handle(request);
        }

        return from(this.storage.get('ACCESS_TOKEN'))
            .pipe(
                switchMap(token => {
                    request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});


                    if (!request.headers.has('Content-Type')) {
                        request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
                    }

                    return next.handle(request).pipe(
                        map((event: HttpEvent<any>) => {
                            if (event instanceof HttpResponse) {
                                // do nothing for now
                            }
                            return event;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            if(error.status === 0)
                            {
                                this.presentAlert(error.status, 'No connection with the server :( ' + environment.serverURL);
                            }

                            if (!token || (error.status && error.status === 401)) {
                                this.router.navigate(['login']);
                            }

                            if (error.error instanceof Object) {
                                this.presentAlert(error.status, error.error.message);
                            } else {
                                this.presentAlert(error.status, error.error);
                            }
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
            buttons: ['OK'],
            duration: 2000
        });

        await alert.present();
    }
}
