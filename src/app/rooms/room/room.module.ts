import { SharedModule } from './../../shared.module';
import { NgModule } from '@angular/core';
import { RoomPageRoutingModule } from './room-routing.module';
import { RoomPage } from './room.page';
import { AutosizeModule } from "ngx-autosize";

@NgModule({
  imports: [
    RoomPageRoutingModule,
    SharedModule,
    AutosizeModule,
  ],
  declarations: [RoomPage],
})
export class RoomPageModule { }
