import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {RoomService} from '../services/rooms/room.service';
import {RoomSocketService} from '../services/rooms/room-socket.service';
import {AlertController} from '@ionic/angular';
import {RoomResponse} from '../interfaces/room-response';
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

        const result = await this.roomService.getRoom(next.params.id);
        const roomResponse = result.room;
        let password: string;

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

        await this.roomService.setUser(next.params.id, password);

        this.roomService.selectedRoom = roomResponse;

        this.roomService.setLinksOfRoom();

        await this.roomService.getMessages();
        await this.roomSocket.OpenSocket();
        return true;

        // TODO: Password.
        // return false;
    }

    private userAlreadyInRoom(roomResponse: any) {

        const currentUser = this.userService.currentUser.user.id.toString();
        for (const user of roomResponse.users){
            console.log(user.user + ' ' + currentUser);
            if(user.user === currentUser){
                return true;
            }
        }
        return false;
    }
}
