import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../user/user.service';
import * as io from 'socket.io-client';
import {RoomService} from './room.service';

@Injectable({
    providedIn: 'root'
})
export class RoomSocketService {
    public roomService: RoomService;
    private socket;

    public onMessageReceived: Array<(userName: string, message: string) => void>;
    public onLinkReceived: Array<(link: string, play: boolean) => void>;
    public onRoomJoined: Array<() => void>;
    public onVideoPaused: Array<(pausedAt: number) => void>;
    public onVideoResumed: Array<(timestamp: number) => void>;
    public onNextVideo: Array<() => void>;
    public onTimestampRequested: Array<() => void>;
    public onUserInfoReceived: Array<(RoomUsersInfo) => void>;

    constructor(private userService: UserService) {
        this.initializeCallbacks();
    }

    public initializeCallbacks()
    {
        this.onLinkReceived = [];
        this.onMessageReceived = [];
        this.onVideoPaused = [];
        this.onVideoResumed = [];
        this.onRoomJoined = [];
        this.onNextVideo = [];
        this.onTimestampRequested = [];
        this.onUserInfoReceived = [];
    }

    public async OpenSocket() {
        const token = await this.userService.getToken();

        if (token && token.length > 0) {
            if(!this.socket)
            {
                this.socket = io(environment.serverURL + '/chat', {forceNew: true, query: {token}});
            }

            this.socket.removeAllListeners()
            this.socket.emit('join room', {roomId: this.roomService.selectedRoom.id});

            this.socket.on('joined room', (data) => {
                this.onRoomJoined.forEach(value => {
                    value();
                })
            });

            this.socket.on('another joined', (data) => {

            });

            this.socket.on('received message', (data) => {
                console.log(this.onMessageReceived.length);
                this.onMessageReceived.forEach(value => {
                    value(data.userId, data.message);
                })
            });

            this.socket.on('videoAddedPlay', (data) => {
                this.onLinkReceived.forEach((value) => {
                    value(data.link, true);
                });
            });

            this.socket.on('videoAdded', (data) => {
                this.onLinkReceived.forEach((value) => {
                    value(data.link, false);
                })
            });

            this.socket.on('queue updated', (data) => {
                this.roomService.updateQueue(data.from, data.to);
            });

            this.socket.on('pause video', (data) => {
                this.onVideoPaused.forEach(value => {
                    value(data.pausedAt);
                })
            });

            this.socket.on('resume video', (data) => {
                this.onVideoResumed.forEach(value => {
                    if (data) {
                        value(data.timestamp);
                    } else {
                        value(undefined);
                    }
                })
            });

            this.socket.on('requestCurTimestamp', () => {
                this.onTimestampRequested.forEach(value => {
                    value();
                })
            });

            this.socket.on('nextVideo', () => {
                console.log('next video')
                this.roomService.nextVideo();
                this.onNextVideo.forEach(value => {
                    value();
                })
            });

            this.socket.on('removeVideo', (data) => {
                this.roomService.links.splice(data.position, 1);
            });

            this.socket.on('send user info', (data) => {
                this.onUserInfoReceived.forEach(value => {
                    value(data);
                })
            })
        }
    }

    public postMessage(msg: string) {
        this.socket.emit('send message', {
            name: this.userService.currentUser.user.name,
            roomId: this.roomService.selectedRoom.id,
            msg
        });
    }

    public addUrl(link: string) {
        this.socket.emit('add url', {link: encodeURIComponent(link)});
    }

    updateQueue(from: number, to: number) {
        this.socket.emit('update queue', {from, to});
    }

    videoPausedAt(currentTime: number) {
        this.socket.emit('video paused', {pausedAt: currentTime});
    }

    public videoResume(currentTime: number) {
        this.socket.emit('video resume');
    }

    public syncRandomUser() {
        this.socket.emit('latest timestamp');
    }

    public sendCurrentTimestamp(timestamp: number) {
        this.socket.emit('sendCurTimestamp', {timestamp});
    }

    public nextVideo() {
        this.socket.emit('nextVideo');
    }

    public removeVideo(position: number) {
        this.socket.emit('removeVideo', {position});
    }

    sendUserInformation(userInfo: { countryCode: string; userName: string }) {
        this.socket.emit('send user info', {userInfo});
    }
}
