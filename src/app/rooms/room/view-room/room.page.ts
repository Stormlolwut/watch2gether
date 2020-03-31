import {Component, OnInit, ViewChild} from '@angular/core';
import {Platform, IonContent} from '@ionic/angular';

import {RoomService} from '../../../services/rooms/room.service';
import {AllMessagesInterface} from '../../../interfaces/room-response';
import {UserService} from '../../../services/user/user.service';

@Component({
    selector: 'app-room',
    templateUrl: './room.page.html',
    styleUrls: ['./room.page.scss']
})
export class RoomPage implements OnInit {
    public messages: Array<any>;

    public currentUser = 'huseyin';
    public newMsg = '';

    @ViewChild('content') content: IonContent;

    constructor(
        private roomService: RoomService,
        private userService: UserService,
        public plt: Platform
    ) {
        this.messages = new Array<any>();

        roomService.onMessageReceived.push((message: string) => {
            this.messages.push({
                username: userService.currentUser.user.name,
                timestamp: new Date().getTime(),
                line: message
            });
            setTimeout(() => {
                this.content.scrollToBottom(200);
            });
        })
    }

    ngOnInit() {
        this.roomService.getMessages((value: AllMessagesInterface) => {
            value.messages.forEach(value1 => {
                this.messages.push({
                    username: value1.user.name,
                    timestamp: value1.timestamp,
                    line: value1.line
                });
            });

            setTimeout(() => {
                this.content.scrollToBottom(200);
            }, 50);
        });
    }

    sendMessage($event: any) {
        this.roomService.postMessage(this.newMsg);
        this.newMsg = '';
        $event.preventDefault();
    }
}
