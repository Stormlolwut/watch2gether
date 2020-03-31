import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-youtube-player-angular',
  templateUrl: './youtube-player-angular.component.html',
  styleUrls: ['./youtube-player-angular.component.scss'],
})
export class YoutubePlayerAngularComponent implements OnInit {
  public player: YT.Player;

  ngOnInit() {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }


  savePlayer(event) {
    this.player = event;

    console.log('player instance', event);
  }

  onStateChange(event) {
    console.log('player state', event.data);
  }
}
