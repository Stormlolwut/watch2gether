import {RoomResponse} from '../interfaces/room-response';
import {RoomsResponse} from '../interfaces/rooms-response';
import {RoomService} from '../services/rooms/room.service';
import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.page.html',
    styleUrls: ['./rooms.page.scss']
})
export class RoomsPage implements OnInit {
    public items: RoomResponse[] = [];

    constructor(
        private menuController: MenuController,
        public roomService: RoomService
    ) {
        roomService.GetRooms((response: RoomsResponse) => this.setRooms(response));
    }

    ngOnInit() {
        this.menuController.close();
    }

    setRooms(rooms: RoomsResponse) {
        rooms.rooms.forEach(element => {
            this.items.push({room: element});
        });

        this.items = [...this.items];
    }

    public onCardClick(room: RoomResponse) {
        this.roomService.OpenRoomPage(room);
    }

    public addRoomButtonClicked($event: MouseEvent) {
        this.roomService.OpenCreateRoomPage();
    }
}
