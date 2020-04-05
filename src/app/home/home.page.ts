import { Component, OnInit } from '@angular/core';
import {AuthResponse} from '../interfaces/auth-response';
import {UserService} from '../services/user/user.service';
import {RoomInterface} from '../interfaces/room-response';
import {RoomService} from '../services/rooms/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public canShowLogoutButton = false;
  public user : AuthResponse;

  public searchOutput: string;
  public rooms : Array<RoomInterface> = [];
  public filteredRooms: Array<RoomInterface> = [];

  private allRoomsLoaded = false;
  private currentPage : number;

  constructor(private userService: UserService, private roomService : RoomService) {
    userService.UserHasLoggedIn().then((value) => {
      this.canShowLogoutButton = value;
    });

    this.user = this.userService.currentUser;
    this.currentPage = 0;
    this.getRooms(this.currentPage++);
  }

  ngOnInit(): void {}

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
    $event.preventDefault();
  }

  async getRooms(page: number){
    await this.roomService.getRooms(page, this.user.user.name + '_'+ this.user.user.discriminator);

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
