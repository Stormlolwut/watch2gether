import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RoomService} from '../services/rooms/room.service';

@Injectable({
    providedIn: 'root'
})
export class RoomGuard implements CanActivate {
    constructor(private roomService: RoomService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


        return true;

        // TODO: Password.
        // return false;
    }

}
