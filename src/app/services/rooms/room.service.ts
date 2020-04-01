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
            .get<RoomsResponse>(environment.serverURL + '/rooms', {})
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
    }

    public OpenRoomPage(response: RoomResponse) {
        this.selectedRoom = response;
        this.router.navigate(['/room', response.room.id]);
    }

    public async CreateRoom(name: string): Promise<RoomResponse> {
        return await this.httpClient.post<RoomResponse>(environment.serverURL + '/rooms', {name}).toPromise();
    }

    public getMessages(onSuccess: (value: AllMessagesInterface) => void) {
        this.getRoom(this.selectedRoom.room.id).then((roomResponse) => {
            this.httpClient
                .get<AllMessagesInterface>(
                    environment.serverURL +
                    '/rooms/' +
                    roomResponse.room.id +
                    '/messages',
                    {}
                )
                .subscribe(value => {
                    onSuccess(value);
                });
        })
    }

    public postMessage(msg: string) {
        this.socket.emit('send message', {roomId: this.selectedRoom.room.id, msg});
    }

    public async getRoom(roomId: string): Promise<RoomResponse> {
        // If current page is room but the selected room is null.
        if (!this.selectedRoom) {
            return await this.httpClient.get<RoomResponse>(
                `${environment.serverURL}/rooms/` + roomId,
                {}
            ).toPromise();
        }

        return this.selectedRoom;
    }

    public async setUser(roomId: string): Promise<RoomResponse> {
        return await this.httpClient
            .post<RoomResponse>(`${environment.serverURL}/rooms/` + roomId + '/users',
                {user: this.userService.currentUser.user.id}).toPromise()
    }

    public OpenCreateRoomPage(): void {
        this.router.navigate(['createRoom']);
    }

    public async OpenSocket() {
        const token = await this.userService.getToken();

        if (token && token.length > 0) {
            this.socket = io(environment.serverURL + '/chat', {query: {token}});
            this.socket.emit('join room', {roomId: this.selectedRoom.room.id});

            this.socket.on('joined room', (data) => {
                console.log(data);
            });

            this.socket.on('received message', (data) => {
                console.log(data);
                this.onMessageReceived.forEach(value => {
                    value(data.message);
                })
            })
        }
    }
}
