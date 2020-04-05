import {Component, OnInit, ViewChild} from '@angular/core';
import {RoomService} from '../../../../services/rooms/room.service';
import {UserService} from '../../../../services/user/user.service';
import {IonContent} from '@ionic/angular';
import {RoomSocketService} from '../../../../services/rooms/room-socket.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import {Router} from '@angular/router';

@Component({
    selector: 'app-room-video',
    templateUrl: './room-video.component.html',
    styleUrls: ['./room-video.component.scss'],
})
export class RoomVideoComponent implements OnInit {
    @ViewChild('content') private content: IonContent;

    public isOwner : boolean;

    constructor(public roomService: RoomService,
                public userService: UserService,
                private router : Router,
                private roomSocket: RoomSocketService,
                private vibration: Vibration) {
        setTimeout(() => {
            this.content.scrollToBottom(200);
        }, 1000);

        const roles = this.fetchUserRoleFromRoom();
        this.isOwner = roles.includes('owner');
    }

    ngOnInit() {
        this.roomSocket.onMessageReceived.push((userName: string, message: string) => {
            setTimeout(() => {
                this.content.scrollToBottom(200);
            });
        });
    }
    sendMessage($event: any) {
        this.roomSocket.postMessage(this.roomService.newMsg);
        this.roomService.newMsg = '';
        $event.preventDefault();
    }
    onValueChanged($event: CustomEvent) {
        this.roomService.newMsg = $event.detail.value;
    }

    nextButtonClicked() {
        this.roomSocket.nextVideo();
        this.vibration.vibrate(1000);
    }

    private fetchUserRoleFromRoom() : Array<string>{
        const user = this.userService.currentUser.user;
        const room = this.roomService.selectedRoom;

        for (const roomUser of room.users){
            if(roomUser.user === user.id && roomUser.roles){
                return roomUser.roles;
            }

        }
        return ['guest'];
    }

    async leaveButtonClicked(){
        const response = await this.roomService.removeUser();
        if(response.statusCode.toString() === '200'){
            await this.router.navigate(['rooms']);
        }
    }

    async deleteRoomButtonClicked(){
        const response = await this.roomService.deleteRoom();
        if(response === '200'){
            await this.router.navigate(['rooms']);
        }
    }

    settingsButtonClicked() {
        this.router.navigate([`room/${this.roomService.selectedRoom.id}/settings`]);
    }
}
