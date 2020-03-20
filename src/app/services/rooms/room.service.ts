import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RoomsResponse } from './../../interfaces/room-response';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  GetRooms(success: (response: RoomsResponse) => void): void  {
    this.httpClient.get<RoomsResponse>(environment.serverURL + "rooms", {}).subscribe((value) => {
      success(value);      
    })
  }

  constructor(private httpClient: HttpClient) { }
} 
