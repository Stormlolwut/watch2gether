import {UserService} from '../user/user.service';
import {AllMessagesInterface} from '../../interfaces/room-response';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RoomsResponse} from '../../interfaces/rooms-response';
import {Injectable} from '@angular/core';
import {RoomResponse} from 'src/app/interfaces/room-response';
import {ActivatedRoute, Router} from '@angular/router';
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
        private activateRoute: ActivatedRoute,
        private userService: UserService,
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

    getMessages(onSuccess: (value: AllMessagesInterface) => void) {
        this.checkIfRoomIsOpen();

        this.checkIfRoomIsSelected().then((roomResponse) => {
            this.httpClient
                .get<AllMessagesInterface>(
                    environment.serverURL +
                    'rooms/' +
                    roomResponse.room.id +
                    '/messages',
                    {}
                )
                .subscribe(value => {
                    onSuccess(value);
                });
        })
    }

    postMessage(msg: string) {
        this.socket.emit('my message', {message: msg, roomId: this.selectedRoom.room.id});
    }

    private checkIfRoomIsOpen(): boolean {
        const isOpen = this.router.url.split('/')[1] === 'room';
        if (!isOpen) {
            this.router.navigate(['rooms']);
        }
        return isOpen;
    }

    private async checkIfRoomIsSelected(): Promise<RoomResponse> {
        // If current page is room but the selected room is null.
        const roomUrl = this.router.url.split('/');
        if (!this.selectedRoom) {
            return await this.httpClient.get<RoomResponse>(
                environment.serverURL + 'rooms/' + roomUrl[2],
                {}
            ).toPromise();
        }

        return this.selectedRoom;
    }
}
