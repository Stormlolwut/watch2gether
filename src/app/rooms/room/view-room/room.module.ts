import {SharedModule} from '../../../shared.module';
import {NgModule} from '@angular/core';
import {RoomPageRoutingModule} from './room-routing.module';
import {RoomPage} from './room.page';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {YoutubePlayerAngularComponent} from '../../youtubePlayer/youtube-player-angular/youtube-player-angular.component';
import {RoomVideoComponent} from './room-video/room-video.component';
import {RoomVideoListComponent} from './room-video-list/room-video-list.component';
import {RoomUsersComponent} from './room-users/room-users.component';
import {Vibration} from '@ionic-native/vibration/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

@NgModule({
    imports: [
        RoomPageRoutingModule,
        SharedModule,
        YouTubePlayerModule,
    ],
    declarations: [RoomPage, YoutubePlayerAngularComponent, RoomVideoComponent, RoomVideoListComponent, RoomUsersComponent],
    providers: [Vibration, Geolocation, NativeGeocoder]
})
export class RoomPageModule {
}
