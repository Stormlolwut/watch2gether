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
        const playVideo = (link) => this.onPlayVideo(link);

        if (roomService.onPlayVideo.length === 0)
            roomService.onPlayVideo.push(playVideo);
        if (roomSocket.onVideoPaused.length === 0)
            roomSocket.onVideoPaused.push((pausedAt) => this.onPauseVideo(pausedAt));
        if (roomSocket.onVideoResumed.length === 0)
            roomSocket.onVideoResumed.push((time) => this.onResumeVideo(time));
        if (roomSocket.onRoomJoined.length !== 2)
            roomSocket.onRoomJoined.push(() => this.onRoomJoined());
        if (roomSocket.onTimestampRequested.length === 0)
            roomSocket.onTimestampRequested.push(() => this.onTimeStampRequested());
        if (roomSocket.onNextVideo.length === 0)
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

        this.tryLoadPlayer();
    }

    tryLoadPlayer() {
        setTimeout(() => {
            if (this.roomService.links.length > 0) {
                if (this.player) {
                    this.onPlayVideo(this.roomService.links[0].link);
                } else {
                    this.tryLoadPlayer();
                }
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
        if (this.player) {
            this.player.pauseVideo();
            this.player.seekTo(pausedAt, true)
        }
    }

    private onResumeVideo(timestamp: number) {
        if (this.player) {
            if (timestamp) {
                setTimeout(() => {
                    if (this.player) {
                        this.player.seekTo(timestamp + 1, true)
                        this.player.playVideo();
                    }
                }, 1000);
            } else {
                this.player.playVideo();
            }
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
                setTimeout(() => {
                    this.player.playVideo();
                }, 1000)
            }
        }, 1000);
    }
}
