import {Injectable} from '@angular/core';
import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RoomService} from '../services/rooms/room.service';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateRoomGuard implements CanDeactivate<unknown> {
    constructor(private roomService: RoomService) {
    }

    async canDeactivate(
        component: unknown,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Promise<boolean | UrlTree> {


        return true;
    }
}
