import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../../services/rooms/room.service';
import {timeout} from 'rxjs/operators';
import {RoomSocketService} from '../../../services/rooms/room-socket.service';

@Component({
    selector: 'app-youtube-player-angular',
    templateUrl: './youtube-player-angular.component.html',
    styleUrls: ['./youtube-player-angular.component.scss'],
})
export class YoutubePlayerAngularComponent implements OnInit {
    public player: YT.Player;


    constructor(private roomService: RoomService, private roomSocket: RoomSocketService) {
        roomService.onPlayVideo.push((link) => this.onPlayVideo(link))
    }

    ngOnInit() {
        const tag = document.createElement('script');

        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }


    savePlayer(event) {
        this.player = event.target;
        this.player.addEventListener('onStateChange', (data: YT.OnStateChangeEvent) => {
            if(data.data === YT.PlayerState.PAUSED )
            {
                console.log("Paused")
            }
            else if(data.data === YT.PlayerState.PLAYING)
            {
                console.log("Playing");
                this.roomService
            }
        })
    }

    onPlayVideo(link: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = decodeURIComponent(link).match(regExp);
        if (match && match[2].length === 11) {
            this.player.loadVideoById(match[2]);
        }
    }
}
