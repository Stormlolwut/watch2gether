import {ActivatedRoute, ParamMap} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {Platform, IonContent} from '@ionic/angular';

import {RoomService} from '../../services/rooms/room.service';
import {AllMessagesInterface, MessageInterface} from '../../interfaces/room-response';

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
        private route: ActivatedRoute,
        private roomService: RoomService,
        public plt: Platform
    ) {
        this.messages = new Array<any>();
        this.route.paramMap
            .pipe(
                switchMap((params: ParamMap) =>
                    this.roomService.GetRoom(params.get('id'))
                )
            )
            .subscribe(value => {
            });

        roomService.onMessageReceived.push((message: string) => {
            this.messages.push({
                username: 'huseyin',
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
            console.log(value);
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

    sendMessage() {
        this.roomService.postMessage(this.newMsg);
    }
}
