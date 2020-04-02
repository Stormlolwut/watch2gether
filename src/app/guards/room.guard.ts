import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {RoomService} from '../services/rooms/room.service';
import {UserService} from '../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class RoomGuard implements CanActivate {

    constructor(private roomService: RoomService, private userService: UserService) {

    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const roomResponse = await this.roomService.getRoom(next.params.id);

        await this.roomService.setUser(next.params.id);

        this.roomService.selectedRoom = roomResponse;

        await this.roomService.getMessages();
        await this.roomService.OpenSocket();
        return true;

        // TODO: Password.
        // return false;
    }
}
