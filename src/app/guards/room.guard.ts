import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {RoomService} from '../services/rooms/room.service';
import {RoomSocketService} from '../services/rooms/room-socket.service';

@Injectable({
    providedIn: 'root'
})
export class RoomGuard implements CanActivate {

    constructor(private roomService: RoomService, private roomSocket: RoomSocketService) {

    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const roomResponse = await this.roomService.getRoom(next.params.id);

        await this.roomService.setUser(next.params.id);

        this.roomService.selectedRoom = roomResponse;

        this.roomService.setLinksOfRoom();
        await this.roomService.getMessages();
        await this.roomSocket.OpenSocket();
        return true;

        // TODO: Password.
        // return false;
    }
}
