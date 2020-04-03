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


    constructor(private roomService: RoomService, private roomSocket: RoomSocketService) {
        roomService.onPlayVideo.push((link) => this.onPlayVideo(link));
        roomSocket.onVideoPaused.push((pausedAt) => this.onPauseVideo(pausedAt));
        roomSocket.onVideoResumed.push(() => this.onResumeVideo());
        roomSocket.onRoomJoined.push(() => this.onRoomJoined());
        roomSocket.onTimeRequested.push(() => this.onTimeRequested());
    }

    public player: YT.Player;

    private playVideoIfReader: boolean;

    ngOnInit() {
        const tag = document.createElement('script');

        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }


    savePlayer(event) {
        this.player = event.target;
        this.player.addEventListener('onStateChange', (data: YT.OnStateChangeEvent) => {
            if (data.data === YT.PlayerState.PAUSED) {
                console.log('Paused')
                this.roomSocket.videoPausedAt(data.target.getCurrentTime());
            } else if (data.data === YT.PlayerState.PLAYING) {
                console.log('Playing');
                this.roomSocket.videoResume(data.target.getCurrentTime());
            }
        });

        setTimeout(() => {
            if (this.roomService.links.length > 0) {
                this.onPlayVideo(this.roomService.links[0].link);
            }
        }, 1000);

        console.log(this.player.getPlayerState());
    }

    onPlayVideo(link: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = decodeURIComponent(link).match(regExp);
        if (match && match[2].length === 11) {
            this.player.loadVideoById(match[2]);
        }
    }

    private onPauseVideo(pausedAt: number) {
        this.player.pauseVideo();
        this.player.seekTo(pausedAt, true)
    }

    private onResumeVideo() {
        this.player.playVideo();
    }

    private onRoomJoined() {
        this.playVideoIfReader = true;
    }

    private onTimeRequested() {
        if (this.player && this.player.getPlayerState() !== YT.PlayerState.CUED) {
            this.roomSocket.videoPausedAt(this.player.getCurrentTime());
            this.roomSocket.videoResume(this.player.getCurrentTime());
        }
    }
}
