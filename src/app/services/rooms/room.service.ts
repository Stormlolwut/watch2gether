import {UserService} from '../user/user.service';
import {AllMessagesInterface} from '../../interfaces/room-response';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RoomsResponse} from '../../interfaces/rooms-response';
import {Injectable} from '@angular/core';
import {RoomResponse} from 'src/app/interfaces/room-response';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomSocketService} from './room-socket.service';

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    public newMsg = '';
    public messages: Array<any>;
    public rooms: Array<any>;
    public links: { link: string, title: string }[] = [];

    public selectedRoom: RoomResponse;
    public onPlayVideo: Array<(link: string) => void>;

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private userService: UserService,
        private roomSocket: RoomSocketService
    ) {
        this.messages = new Array<any>();
        this.onPlayVideo = new Array<(link: string) => void>();
        this.roomSocket.roomService = this;

        roomSocket.onMessageReceived.push((username, message) => {this.OnMessageReceived(username, message)});
        roomSocket.onLinkReceived.push((url, play) => this.onLinkReceived(url, play));
    }

    public async getRooms(page: number) {
            console.log(page);
         await this.httpClient.get<RoomsResponse>(environment.serverURL + `/rooms?pageIndex=${page}`, {}).toPromise().then((value) => {
             this.rooms = value.rooms;
         });
    }

    public OpenRoomPage(response: RoomResponse) {
        this.selectedRoom = response;
        this.router.navigate(['/room', response.id]);
    }

    public async CreateRoom(name: string, password: string, categoriesUnfiltered: string): Promise<RoomResponse> {

        const categories = categoriesUnfiltered.split(',');

        return await this.httpClient.post<RoomResponse>(environment.serverURL + '/rooms', {name, password, categories}).toPromise();
    }

    public async getMessages() {
        const url = `${environment.serverURL}/rooms/${this.selectedRoom.room.id}/messages`;

        await this.httpClient.get<AllMessagesInterface>(url).toPromise().then((value) => {
            this.messages = value.messages;
        });

    }

    public async getRoom(roomId: string): Promise<RoomResponse> {
        return await this.httpClient.get<RoomResponse>(
            `${environment.serverURL}/rooms/` + roomId,
            {}
        ).toPromise();
    }

    public async setUser(roomId: string, password: string): Promise<RoomResponse> {
        return await this.httpClient
            .post<RoomResponse>(`${environment.serverURL}/rooms/` + roomId + '/users',
                {user: this.userService.currentUser.user.id, password}).toPromise()
    }

    public OpenCreateRoomPage(): void {
        this.router.navigate(['createRoom']);
    }

    public OnMessageReceived(userName: string, message: string) {
        this.messages.push({
            sender: {name: userName},
            timestamp: new Date().getTime(),
            line: message
        });
    }

    public setLinksOfRoom() {
        this.links = new Array<{ link: string, title: string }>(this.selectedRoom.room.queue.length);
        this.selectedRoom.room.queue.forEach((value, index) => {
            this.links[index] = {link: 'loading', title: 'loading'};
            this.httpClient.get<any>(`https://noembed.com/embed?url=${value.link}`)
                .subscribe((json) => {
                        this.links[value.position] = {link: value.link, title: json.title};
                    },
                    error => console.error(error));
        });
    }

    private onLinkReceived(link: string, play: boolean) {
        this.httpClient.get<any>(`https://noembed.com/embed?url=${link}`)
            .subscribe((json) => {
                    this.links.push({link, title: json.title});
                },
                error => console.error(error));
        if(play)
        {
            this.onPlayVideo.forEach(value => {
                value(link);
            })
        }
    }

    public updateQueue(from: number, to: number) {
        const temp = this.links[from];

        this.links[from] = this.links[to];
        this.links[to] = temp;
        console.log(this.links)
    }

    public nextVideo() {
        this.links.shift();
    }
}
