import { RoomPageRoutingModule } from './../../rooms/room/room-routing.module';
import { MessageInterface } from './../../interfaces/room-response';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RoomsResponse } from '../../interfaces/rooms-response';
import { Injectable } from '@angular/core';
import { RoomResponse } from 'src/app/interfaces/room-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public selectedRoom: RoomResponse;

  public GetRooms(success: (response: RoomsResponse) => void): void {
    this.httpClient.get<RoomsResponse>(environment.serverURL + "rooms", {}).subscribe((value) => {
      success(value);
    })
  }

  constructor(private httpClient: HttpClient, private router: Router) {
    this.selectedRoom = null;
  }

  public OpenRoom(response: RoomResponse) {
    this.router.navigate(["/room", response.room.id]);
  }

  public GetRoom(roomName: string): Observable<RoomResponse> {
    return this.httpClient.get<RoomResponse>(environment.serverURL + "rooms/" + roomName, {});
  }

  getMessages(onSuccess: (value: Array<MessageInterface>) => void) {
    this.httpClient.get<Array<MessageInterface>>(environment.serverURL + "rooms/" + this.selectedRoom.room.name + "/messages", {}).subscribe((value) => {
      onSuccess(value);
    });
  }
} 
