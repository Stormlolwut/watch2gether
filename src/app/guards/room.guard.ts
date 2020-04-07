import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {RoomService} from '../services/rooms/room.service';
import {RoomSocketService} from '../services/rooms/room-socket.service';
import {AlertController} from '@ionic/angular';
import {RoomInterface} from '../interfaces/room-response';
import {UserService} from '../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class RoomGuard implements CanActivate {

    constructor(private roomService: RoomService, private userService: UserService,
                private roomSocket: RoomSocketService, private alertController: AlertController) {
    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const roomResponse = await this.roomService.getRoom(next.params.id);

        let password: string;
        if (!this.userService.currentUser) {
            await this.userService.getUserInformation();
        }

        if (roomResponse.password !== '' && !this.userAlreadyInRoom(roomResponse)) {
            const alert = await this.alertController.create({
                header: 'Password required!',
                inputs: [{
                    name: 'password',
                    type: 'password'
                }],
                buttons: ['Confirm'],
            });

            await alert.present();
            const passwordResponse = await alert.onDidDismiss();
            password = passwordResponse.data?.values?.password;
        }

        this.roomService.selectedRoom = roomResponse;

        await this.roomService.setLinksOfRoom();
        await this.roomService.getMessages();
        await this.roomSocket.OpenSocket();
        await this.roomService.setUser(next.params.id, password);

        return true;
    }

    private userAlreadyInRoom(roomResponse: RoomInterface) {

        const currentUser = this.userService.currentUser.user.id.toString();
        console.log(roomResponse.users);
        for (const user of roomResponse.users) {
            if (user.user === currentUser) {
                return true;
            }
        }
        return false;
    }
}
