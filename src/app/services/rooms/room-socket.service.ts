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

    constructor(private userService: UserService) {
        this.onLinkReceived = new Array<(link: string, play: boolean) => void>();
        this.onMessageReceived = new Array<(message: string) => void>();
    }

    public async OpenSocket() {
        const token = await this.userService.getToken();

        if (token && token.length > 0) {
            this.socket = io(environment.serverURL + '/chat', {forceNew: true, query: {token}});
            this.socket.emit('join room', {roomId: this.roomService.selectedRoom.room.id});

            this.socket.on('joined room', (data) => {
                console.log(data);
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
}
