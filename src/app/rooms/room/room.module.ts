import { SharedModule } from './../../shared.module';

import { NgModule } from '@angular/core';

import { RoomPageRoutingModule } from './room-routing.module';

import { RoomPage } from './room.page';

@NgModule({
  imports: [
    RoomPageRoutingModule,
    SharedModule
  ],
  declarations: [RoomPage],
})
export class RoomPageModule {}
