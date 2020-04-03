import {Component, OnInit, ViewChild} from '@angular/core';
import {Platform, IonContent} from '@ionic/angular';

@Component({
    selector: 'app-room',
    templateUrl: './room.page.html',
    styleUrls: ['./room.page.scss']
})
export class RoomPage implements OnInit {
    @ViewChild('content') content: IonContent;

    public currentRoomState;
    public roomStates;


    constructor(public plt: Platform) {
        this.roomStates = {Room: 'room', Videos: 'videos', Users: 'users'};
        this.currentRoomState = this.roomStates.Room;
    }

    ngOnInit() {
    }

    activateRoom() {
        this.currentRoomState = this.roomStates.Room;
    }

    activateVideos() {
        this.currentRoomState = this.roomStates.Videos;
    }

    activateUsers() {
        this.currentRoomState = this.roomStates.Users;
    }
}
