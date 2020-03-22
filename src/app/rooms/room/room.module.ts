import { SharedModule } from './../../shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

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
