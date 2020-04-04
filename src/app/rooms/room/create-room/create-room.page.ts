import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../../services/rooms/room.service';
import {Platform, ToastController} from '@ionic/angular';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
    selector: 'app-create-room',
    templateUrl: './create-room.page.html',
    styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage implements OnInit {
    private roomName: FormControl;
    private roomPassword: FormControl;
    public roomForm: FormGroup;
    public roomCategories: FormControl;


    constructor(private roomService: RoomService, private toastController: ToastController, private formBuilder: FormBuilder,
                public platform: Platform, private router: Router) {
        this.roomForm = formBuilder.group({
            roomName: ['', Validators.required],
            roomPassword: [],
            roomCategories: ['public'],
        });

        this.roomName = this.roomForm.get('roomName') as FormControl;
        this.roomPassword = this.roomForm.get('roomPassword') as FormControl;
        this.roomCategories = this.roomForm.get('roomCategories') as FormControl;
    }

    ngOnInit() {

    }

    processForm() {
        if (this.roomForm.valid) {
            this.roomService.CreateRoom(this.roomName.value, this.roomPassword.value, this.roomCategories.value).then((value) => {
                this.router.navigate(['rooms']);
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
