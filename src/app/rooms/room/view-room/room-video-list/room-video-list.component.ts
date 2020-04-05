import {Component, OnInit} from '@angular/core';
import {RoomSocketService} from '../../../../services/rooms/room-socket.service';
import {ToastController} from '@ionic/angular';
import {RoomService} from '../../../../services/rooms/room.service';

@Component({
    selector: 'app-room-video-list',
    templateUrl: './room-video-list.component.html',
    styleUrls: ['./room-video-list.component.scss'],
})
export class RoomVideoListComponent implements OnInit {
    private newUrl: string;

    constructor(private roomSocket: RoomSocketService,
                public roomService: RoomService,
                private toastController: ToastController,) {
    }

    ngOnInit() {
    }

    addVideo() {
        const url = this.newUrl;
        if (url && url !== '') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                this.roomSocket.addUrl(match.input);
            } else {
                this.presentToast();
            }
        }
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Url is not correct',
            duration: 2000
        });

        toast.present();
    }


    inputChange($event: CustomEvent) {
        this.newUrl = $event.detail.value;
    }

    doReorder(ev: CustomEvent) {
        if(ev.detail.from === ev.detail.to - 1)
        {
            ev.detail.complete();
        }
        else if(ev.detail.to === this.roomService.links.length)
        {
            ev.detail.to--;
        }


        this.roomSocket.updateQueue(ev.detail.from, ev.detail.to);

        ev.detail.complete();
    }

    public onNext(item: { link: string, title: string }) {
        this.roomSocket.removeVideo(this.roomService.links.indexOf(item));
    }
}
