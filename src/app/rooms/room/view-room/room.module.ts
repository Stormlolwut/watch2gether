import {SharedModule} from '../../../shared.module';
import {NgModule} from '@angular/core';
import {RoomPageRoutingModule} from './room-routing.module';
import {RoomPage} from './room.page';
import {AutosizeModule} from 'ngx-autosize';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {YoutubePlayerAngularComponent} from '../../youtubePlayer/youtube-player-angular/youtube-player-angular.component';

@NgModule({
    imports: [
        RoomPageRoutingModule,
        SharedModule,
        AutosizeModule,
        YouTubePlayerModule,
    ],
    declarations: [RoomPage, YoutubePlayerAngularComponent],
})
export class RoomPageModule {
}
