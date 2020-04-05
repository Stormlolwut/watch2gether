import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {RoomService} from '../services/rooms/room.service';
import {RoomSocketService} from '../services/rooms/room-socket.service';
import {AlertController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class RoomGuard implements CanActivate {

    constructor(private roomService: RoomService, private roomSocket: RoomSocketService, private alertController: AlertController) {}

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const roomResponse = await this.roomService.getRoom(next.params.id);
        let password: string;

        if(roomResponse.room.password !== ''){
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

        await this.roomService.setUser(next.params.id, password);

        this.roomService.selectedRoom = roomResponse;

        this.roomService.setLinksOfRoom();

        await this.roomService.getMessages();
        await this.roomSocket.OpenSocket();
        return true;

        // TODO: Password.
        // return false;
    }
}
