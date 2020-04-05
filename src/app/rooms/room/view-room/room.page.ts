import {Component, OnInit, ViewChild} from '@angular/core';
import {Platform, IonContent} from '@ionic/angular';
import {RoomService} from '../../../services/rooms/room.service';
import {RoomInterface} from '../../../interfaces/room-response';

@Component({
    selector: 'app-room',
    templateUrl: './room.page.html',
    styleUrls: ['./room.page.scss']
})
export class RoomPage implements OnInit {
    @ViewChild('content') content: IonContent;

    public currentRoomState;
    public roomStates;

    public room : RoomInterface;

    constructor(public plt: Platform, private roomService : RoomService) {
        this.roomStates = {Room: 'room', Videos: 'videos', Users: 'users'};
        this.currentRoomState = this.roomStates.Room;

        this.room = roomService.selectedRoom;
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
