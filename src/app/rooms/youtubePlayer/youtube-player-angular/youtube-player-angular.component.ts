import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../../services/rooms/room.service';
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
        roomSocket.onVideoResumed.push((time) => this.onResumeVideo(time));
        roomSocket.onRoomJoined.push(() => this.onRoomJoined());
        roomSocket.onTimestampRequested.push(() => this.onTimeStampRequested());
        roomSocket.onNextVideo.push(() => this.onNextVideo());
    }

    public player: YT.Player;


    ngOnInit() {
        const tag = document.createElement('script');

        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }


    savePlayer(event) {
        this.player = event.target;
        this.player.addEventListener('onStateChange', (data: YT.OnStateChangeEvent) => {
            if (data.data === YT.PlayerState.PAUSED) {
                this.roomSocket.videoPausedAt(data.target.getCurrentTime());
            } else if (data.data === YT.PlayerState.PLAYING) {
                this.roomSocket.videoResume(data.target.getCurrentTime());
            }
        });

        setTimeout(() => {
            if (this.roomService.links.length > 0) {
                this.onPlayVideo(this.roomService.links[0].link);
            }
        }, 1000);
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

    private onResumeVideo(timestamp: number) {
        if (timestamp) {
            setTimeout(() => {
                this.player.seekTo(timestamp + 4, true)
                this.player.playVideo();
            }, 4000);
        } else {
            this.player.playVideo();
        }
    }

    private onRoomJoined() {
        this.roomSocket.syncRandomUser();
    }

    private onTimeStampRequested() {
        if (this.player) {
            this.roomSocket.sendCurrentTimestamp(this.player.getCurrentTime());
        }
    }

    private onNextVideo() {
        setTimeout(() => {
            if (this.roomService.links.length > 0) {
                this.onPlayVideo(this.roomService.links[0].link);
            }
        }, 1000);
    }
}
