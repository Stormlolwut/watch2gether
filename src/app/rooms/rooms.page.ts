import { RoomsResponse } from './../interfaces/room-response';
import { RoomService } from './../services/rooms/room.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})


export class RoomsPage implements OnInit {
  public items: any[] = [];
  rotateImg: number = 0;

  constructor(private menuController: MenuController, private roomService: RoomService, private httpClient: HttpClient) {
    roomService.GetRooms((response: RoomsResponse) => this.setRooms(response));
  }

  ngOnInit() {
    this.menuController.close();
  }

  setRooms(rooms: RoomsResponse) {
    rooms.rooms.forEach(element => {
      this.items.push({
        index: this.items.length,
        name: element.name,
      })
    });

    this.items = [...this.items];
  }

  public onCardClick(listIndex: number) {
    // TODO: /rooms mag niet alle gegevens returnen: "Zoals password". Zo kan iedereen zien wat de wachtwoord is van de room uit het lijst.
    // TODO: pak het ID van het room en ga naar volgende pagina -> vraag daarna het informatie op van het room.
    console.log(this.items[listIndex]);
  }
}