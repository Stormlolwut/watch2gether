import { MessageInterface } from './../../interfaces/room-response';
import { RoomService } from './../../services/rooms/room.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Platform, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  messages: [MessageInterface];

  currentUser = "huseyin";
  newMsg = "";

  @ViewChild("content") content: IonContent;


  constructor(private route: ActivatedRoute, private roomService: RoomService, public plt: Platform) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.roomService.GetRoom(params.get('id')))
    ).subscribe((value) => {
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.content.scrollToBottom(200);
    })
  }


  sendMessage() {
    this.roomService.postMessage(this.newMsg,
      (response) => {
        this.messages.push({
          user: "huseyin",
          timestamp: new Date(new Date().getTime()),
          line: this.newMsg
        });
      },
      () => { }
    );

    this.newMsg = "";
    setTimeout(() => {
      this.content.scrollToBottom(200);
    })
  }
}
