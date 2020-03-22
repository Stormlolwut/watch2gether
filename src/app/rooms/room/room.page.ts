import { RoomService } from './../../services/rooms/room.service';
import { RoomResponse } from './../../interfaces/room-response';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  private roomResponse: RoomResponse;

  constructor(private route: ActivatedRoute, private roomService: RoomService) { 
    
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.roomService.GetRoom(params.get('id')))
    ).subscribe((value) => {
      console.log(value);
    });

  }

  ngOnInit() {
  }

}
