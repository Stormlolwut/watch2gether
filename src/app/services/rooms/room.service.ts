import {UserService} from '../user/user.service';
import {AllMessagesInterface, MessageInterface} from '../../interfaces/room-response';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RoomsResponse} from '../../interfaces/rooms-response';
import {Injectable} from '@angular/core';
import {RoomResponse} from 'src/app/interfaces/room-response';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    public selectedRoom: RoomResponse;
    private socket;

    public onMessageReceived: Array<(message: string) => void>;

    public GetRooms(success: (response: RoomsResponse) => void): void {
        this.httpClient
            .get<RoomsResponse>(environment.serverURL + 'rooms', {})
            .subscribe(value => {
                success(value);
            });
    }

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private userService: UserService
    ) {
        this.onMessageReceived = new Array<(message: string) => void>();
        this.selectedRoom = null;

        userService.getToken().then(token => {
            if (token !== undefined && token !== null && token.length > 0) {
                this.socket = io(environment.serverURL, {query: {token}});
                this.socket.on('chat message', msg => {
                    this.onMessageReceived.forEach((value1: (message: string) => void) => {
                        value1(msg);
                    })
                });
            }
        });

    }

    public OpenRoom(response: RoomResponse) {
        this.selectedRoom = response;
        this.router.navigate(['/room', response.room.id]);
    }

    public GetRoom(roomName: string): Observable<RoomResponse> {
        return this.httpClient.get<RoomResponse>(
            environment.serverURL + 'rooms/' + roomName,
            {}
        );
    }

    getMessages(onSuccess: (value: AllMessagesInterface) => void) {
        this.httpClient
            .get<AllMessagesInterface>(
                environment.serverURL +
                'rooms/' +
                this.selectedRoom.room.id +
                '/messages',
                {}
            )
            .subscribe(value => {
                onSuccess(value);
            });
    }

    postMessage(msg: string) {
        this.socket.emit('my message', {message: msg, roomId: this.selectedRoom.room.id});
    }
}
