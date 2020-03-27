import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../../services/rooms/room.service';
import {ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'app-create-room',
    templateUrl: './create-room.page.html',
    styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage implements OnInit {
    private roomName: FormControl;
    public roomForm: FormGroup;

    constructor(private roomService: RoomService, private toastController: ToastController, private formBuilder: FormBuilder) {
        this.roomForm = formBuilder.group({
            roomName: ['', Validators.required],
        });

        this.roomName = this.roomForm.get('roomName') as FormControl;
    }

    ngOnInit() {

    }

    processForm() {
        if (this.roomForm.valid) {
            this.roomService.CreateRoom(this.roomName.value).then((value) => {
                this.roomService.OpenRoomPage(value);
            });
        } else {
            this.showToast('Please fill out Room information correctly');
        }
    }

    async showToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 3000
        });
        await toast.present();
    }
}
