import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../../services/rooms/room.service';
import {RoomSocketService} from '../../../services/rooms/room-socket.service';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-youtube-player-angular',
    templateUrl: './youtube-player-angular.component.html',
    styleUrls: ['./youtube-player-angular.component.scss'],
})
export class YoutubePlayerAngularComponent implements OnInit {
    constructor(private roomService: RoomService, private roomSocket: RoomSocketService, private httpClient: HttpClient) {
        if (roomSocket.onVideoPaused.length === 0)
            roomSocket.onVideoPaused.push((pausedAt) => this.onPauseVideo(pausedAt));
        if (roomSocket.onVideoResumed.length === 0)
            roomSocket.onVideoResumed.push((time) => this.onResumeVideo(time));
        if (roomSocket.onRoomJoined.length === 0)
            roomSocket.onRoomJoined.push(() => this.onRoomJoined());
        if (roomSocket.onTimestampRequested.length === 0)
            roomSocket.onTimestampRequested.push(() => this.onTimeStampRequested());
        if (roomSocket.onNextVideo.length === 0)
            roomSocket.onNextVideo.push(() => this.onNextVideo());
        if (roomSocket.onLinkReceived.length === 0)
            roomSocket.onLinkReceived.push((link, play) => this.onLinkReceived(link, play))
    }


    ngOnInit() {
        if (!this.roomService.player) {
            const tag = document.createElement('script');

            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
        } else {
            this.roomService.player = null;
        }

    }


    savePlayer(event) {
        this.roomService.player = event.target;
        this.roomService.player.addEventListener('onStateChange', (data: YT.OnStateChangeEvent) => {
            if (data.data === YT.PlayerState.PAUSED) {
                this.roomSocket.videoPausedAt(data.target.getCurrentTime());
            } else if (data.data === YT.PlayerState.PLAYING) {
                this.roomSocket.videoResume(data.target.getCurrentTime());
            }
        });


        if(this.roomService.links.length > 0)
            this.tryLoadPlayerId(this.roomService.links[0].link);
    }

    tryLoadPlayerId(id: string) {
        setTimeout(() => {
            if (this.roomService.player) {
                this.onPlayVideo(id);
                setTimeout(() => {
                    this.roomService.player.playVideo();
                }, 1000);
            } else {
                this.tryLoadPlayerId(id);
            }
        });
    }

    onPlayVideo(link: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = decodeURIComponent(link).match(regExp);
        if (match && match[2].length === 11) {
            this.roomService.player.loadVideoById(match[2]);
        }
    }

    private onPauseVideo(pausedAt: number) {
        if (this.roomService.player) {
            this.roomService.player.pauseVideo();
            this.roomService.player.seekTo(pausedAt, true)
        }
    }

    private onResumeVideo(timestamp: number) {
        if (timestamp) {
            this.tryLoadPlayer(timestamp);
        } else {
            this.tryLoadPlayer(undefined);
        }
    }

    private tryLoadPlayer(timestamp: number) {
        setTimeout(() => {
            if (this.roomService.player) {
                this.roomService.player.playVideo();
                if (timestamp) {
                    this.roomService.player.seekTo(timestamp, true)
                }
            } else {
                this.tryLoadPlayer(timestamp);
            }
        });
    }


    private onRoomJoined() {
        this.roomSocket.syncRandomUser();

    }

    private onTimeStampRequested() {
        if (this.roomService.player) {
            console.log(this.roomService.player.getCurrentTime());
            this.roomSocket.sendCurrentTimestamp(this.roomService.player.getCurrentTime());
        }
    }

    private onNextVideo() {
        setTimeout(() => {
            if (this.roomService.links.length > 0) {
                this.onPlayVideo(this.roomService.links[0].link);
                setTimeout(() => {
                    this.roomService.player.playVideo();
                }, 1000)
            }
        }, 1000);
    }

    private onLinkReceived(link: string, play: boolean) {
        this.httpClient.get<any>(`https://noembed.com/embed?url=${link}`).subscribe((json) => {
                this.roomService.links.push({link, title: json.title});
            },
            error => console.error(error));

        if (play) {
            this.tryLoadPlayerId(link);
        }
    }

    apiChanged($event: YT.PlayerEvent) {
        this.roomService.player = $event.target;
    }
}
