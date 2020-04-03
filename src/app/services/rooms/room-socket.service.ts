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
    public onVideoResumed: Array<() => void>;
    public onTimeRequested: Array<() => void>;

    constructor(private userService: UserService) {
        this.onLinkReceived = new Array<(link: string, play: boolean) => void>();
        this.onMessageReceived = new Array<(message: string) => void>();
        this.onVideoPaused = new Array<(pausedAt: number) => void>()
        this.onVideoResumed = new Array<() => void>();
        this.onRoomJoined = new Array<() => void>();
        this.onTimeRequested = new Array<() => void>();
    }

    public async OpenSocket() {
        const token = await this.userService.getToken();

        if (token && token.length > 0) {
            this.socket = io(environment.serverURL + '/chat', {forceNew: true, query: {token}});
            this.socket.emit('join room', {roomId: this.roomService.selectedRoom.room.id});

            this.socket.on('joined room', (data) => {
                console.log('hello people');
                this.onRoomJoined.forEach(value => {
                    value();
                })
            });

            this.socket.on('received message', (data) => {
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
                    value(data.link, true);
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
                    value();
                })
            })

            this.socket.on('request time', () => {
                this.onTimeRequested.forEach(value => {
                    value();
                })
            })
        }
    }

    public postMessage(msg: string) {
        this.socket.emit('send message', {
            name: this.userService.currentUser.user.name,
            roomId: this.roomService.selectedRoom.room.id,
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
}
