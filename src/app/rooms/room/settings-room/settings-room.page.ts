import {Component, OnInit} from '@angular/core';
import {RoomInterface} from '../../../interfaces/room-response';
import {RoomService} from '../../../services/rooms/room.service';
import {UserService} from '../../../services/user/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'app-settings-room',
    templateUrl: './settings-room.page.html',
    styleUrls: ['./settings-room.page.scss'],
})
export class SettingsRoomPage implements OnInit {

    public room: RoomInterface;
    public newRoom: FormGroup;

    constructor(private roomService: RoomService, private route: Router) {
        this.room = roomService.selectedRoom;

        this.newRoom = new FormGroup({
            name: new FormControl(),
            password: new FormControl()
        });
    }


    ngOnInit() {
    }


    async updateRoom() {
        if (this.newRoom.valid) {
            const newName = (this.newRoom.value.name) ?
                this.newRoom.value.name.toString().toLowerCase() : this.roomService.selectedRoom.name;
            const newPassword = (this.newRoom.value.password) ?
                this.newRoom.value.password.toString() : this.roomService.selectedRoom.password;

            const room = {
                name: newName,
                password: newPassword
            };
            const response = await this.roomService.updateRoom(room);

            if (response.statusCode) {
                this.roomService.selectedRoom = response.room;
                await this.route.navigate(['rooms']);
                await this.route.navigate([`rooms/${response.room.id.toLowerCase()}`])
            }
        }
    }
}
