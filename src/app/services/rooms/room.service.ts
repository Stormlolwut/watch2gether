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
    public newMsg = '';
    public messages: Array<any>;

    public selectedRoom: RoomResponse;
    private socket;

    public onMessageReceived: Array<(userName: string, message: string) => void>;
    public onMessagesLoaded;

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
        this.messages = new Array<any>();
        this.onMessageReceived = new Array<(message: string) => void>();
    }

    public OpenRoomPage(response: RoomResponse) {
        this.selectedRoom = response;
        this.router.navigate(['/room', response.room.id]);
    }

    public async CreateRoom(name: string): Promise<RoomResponse> {
        return await this.httpClient.post<RoomResponse>(environment.serverURL + '/rooms', {name}).toPromise();
    }

    public async getMessages() {
        const url = `${environment.serverURL}/rooms/${this.selectedRoom.room.id}/messages`;

        await this.httpClient.get<AllMessagesInterface>(url).toPromise().then((value) => {
            this.messages = value.messages;
        });

    }

    public postMessage(msg: string) {
        this.socket.emit('send message', {name: this.userService.currentUser.user.name, roomId: this.selectedRoom.room.id, msg});
    }

    public async getRoom(roomId: string): Promise<RoomResponse> {
        return await this.httpClient.get<RoomResponse>(
            `${environment.serverURL}/rooms/` + roomId,
            {}
        ).toPromise();
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
            this.socket = io(environment.serverURL + '/chat', {forceNew: true, query: {token}});
            this.socket.emit('join room', {roomId: this.selectedRoom.room.id});

            this.socket.on('joined room', (data) => {
                console.log(data);
            });

            this.socket.on('received message', (data) => {
                this.messages.push({
                    sender: { name: data.userId },
                    timestamp: new Date().getTime(),
                    line: data.message
                });

                this.onMessageReceived.forEach(value => {
                    value(data.userId, data.message);
                })
            })
        }
    }
}
