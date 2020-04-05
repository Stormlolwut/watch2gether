import {RoomInterface, RoomResponse} from '../interfaces/room-response';
import {RoomsResponse} from '../interfaces/rooms-response';
import {RoomService} from '../services/rooms/room.service';
import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController} from '@ionic/angular';
import {UserService} from '../services/user/user.service';

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.page.html',
    styleUrls: ['./rooms.page.scss']
})
export class RoomsPage implements OnInit {

    public searchOutput: string;
    public rooms : Array<RoomInterface> = [];
    public filteredRooms: Array<RoomInterface> = [];

    private allRoomsLoaded = false;
    private currentPage : number;

    constructor(private menuController: MenuController, public userService: UserService, public roomService: RoomService, private alertController: AlertController) {
        this.currentPage = 0;
        this.getRooms(this.currentPage++);
    }

    ngOnInit() {
        this.menuController.close();
    }

   /* setRooms(rooms: RoomsResponse) {
        rooms.rooms.forEach(element => {
            this.items.push({room: element});
        });
        this.items = [...this.items];
        this.filteredRooms = this.items;
    }
*/
    public async onCardClick(room: RoomInterface) {
        this.roomService.OpenRoomPage(room);
    }

    public addRoomButtonClicked($event: MouseEvent) {
        this.roomService.OpenCreateRoomPage();
    }

    public filterRooms(){
        if(this.searchOutput === '') return this.filteredRooms = this.rooms;

        this.filteredRooms = this.rooms.filter(x => {
             if(x.categories.includes(this.searchOutput.toLowerCase())){
                 return x;
             } else if (x.name.toLowerCase().includes(this.searchOutput.toLowerCase())){
                 return x;
             }
        });
    }
    public addChipToSearchBar($event, category: string) {
        this.searchOutput = category;
        console.log($event);
        $event.preventDefault();
    }

    async getRooms(page: number){
        await this.roomService.getRooms(page, undefined);

        this.rooms = this.rooms.concat(this.roomService.rooms);
        this.filteredRooms = this.filteredRooms.concat(this.roomService.rooms);

        if(this.roomService.rooms.length !== 10){ this.allRoomsLoaded = true;}
    }

    async onRefresh($event){
        this.currentPage = 0;
        this.rooms = [];
        this.filteredRooms = [];

        await this.getRooms(this.currentPage++);
        return $event.target.complete();
    }

    async loadData($event) {
        if (this.allRoomsLoaded)
            return $event.target.complete();

        await this.getRooms(this.currentPage++);
        $event.target.complete();
    }
}
