import { RoomService } from './../../services/rooms/room.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Platform, IonGrid, IonContent } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  messages = [
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'storm',
      createdAt: 1554090956000,
      msg: 'ey ey ey bitch'
    },
    {
      user: 'storm',
      createdAt: 15540901056000,
      msg: 'I am totally gay lol xD :3'
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'storm',
      createdAt: 1554090956000,
      msg: 'ey ey ey bitch'
    },
    {
      user: 'storm',
      createdAt: 15540901056000,
      msg: 'I am totally gay lol xD :3'
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'storm',
      createdAt: 1554090956000,
      msg: 'ey ey ey bitch'
    },
    {
      user: 'storm',
      createdAt: 15540901056000,
      msg: 'I am totally gay lol xD :3'
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'storm',
      createdAt: 1554090956000,
      msg: 'ey ey ey bitch'
    },
    {
      user: 'storm',
      createdAt: 15540901056000,
      msg: 'I am totally gay lol xD :3'
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
    {
      user: 'huseyin',
      createdAt: 1554090856000,
      msg: "yo yo yoo bitch"
    },
  ]

  currentUser = "huseyin";
  newMsg = "";

  @ViewChild("content") content: IonContent;


  constructor(private route: ActivatedRoute, private roomService: RoomService, public plt: Platform) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.roomService.GetRoom(params.get('id')))
    ).subscribe((value) => {
      console.log(value);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.content.scrollToBottom(200);
    })
  }


  sendMessage() {
    this.messages.push({
      user: "huseyin",
      createdAt: new Date().getTime(),
      msg: this.newMsg
    })

    this.newMsg = "";

    setTimeout(() => {
      this.content.scrollToBottom(200);
    })
  }
}
