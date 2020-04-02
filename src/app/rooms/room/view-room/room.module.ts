import {SharedModule} from '../../../shared.module';
import {NgModule} from '@angular/core';
import {RoomPageRoutingModule} from './room-routing.module';
import {RoomPage} from './room.page';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {YoutubePlayerAngularComponent} from '../../youtubePlayer/youtube-player-angular/youtube-player-angular.component';
import {RoomVideoComponent} from './room-video/room-video.component';
import {RoomVideoListComponent} from './room-video-list/room-video-list.component';
import {RoomUsersComponent} from './room-users/room-users.component';

@NgModule({
    imports: [
        RoomPageRoutingModule,
        SharedModule,
        YouTubePlayerModule
    ],
    declarations: [RoomPage, YoutubePlayerAngularComponent, RoomVideoComponent, RoomVideoListComponent, RoomUsersComponent],
})
export class RoomPageModule {
}
