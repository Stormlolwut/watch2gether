import {Component, OnInit, ViewChild} from '@angular/core';
import {RoomService} from '../../../../services/rooms/room.service';
import {UserService} from '../../../../services/user/user.service';
import {IonContent} from '@ionic/angular';

@Component({
    selector: 'app-room-video',
    templateUrl: './room-video.component.html',
    styleUrls: ['./room-video.component.scss'],
})
export class RoomVideoComponent implements OnInit {
    @ViewChild('content') private content: IonContent;

    constructor(public roomService: RoomService, public userService: UserService) {
        setTimeout(() => {
            this.content.scrollToBottom(200);
        }, 1000);
    }

    ngOnInit() {
        this.roomService.onMessageReceived.push((userName: string, message: string) => {
            setTimeout(() => {
                this.content.scrollToBottom(200);
            });
        });

    }


    sendMessage($event: any) {
        this.roomService.postMessage(this.roomService.newMsg);
        this.roomService.newMsg = '';
        $event.preventDefault();
    }

    onValueChanged($event: CustomEvent) {
        this.roomService.newMsg = $event.detail.value;
    }
}
