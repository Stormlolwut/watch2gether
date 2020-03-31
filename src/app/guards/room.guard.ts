import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RoomService} from '../services/rooms/room.service';
import {RoomResponse} from '../interfaces/room-response';

@Injectable({
    providedIn: 'root'
})
export class RoomGuard implements CanActivate {
    constructor(private roomService: RoomService) {
    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const roomResponse = await this.roomService.getRoom(next.params.id);

        await this.roomService.setUser(next.params.id)

        this.roomService.selectedRoom = roomResponse;
        this.roomService.OpenSocket();
        return true;

        // TODO: Password.
        // return false;
    }
}
