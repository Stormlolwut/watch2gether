import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsRoomPageRoutingModule } from './settings-room-routing.module';

import { SettingsRoomPage } from './settings-room.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SettingsRoomPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [SettingsRoomPage]
})
export class SettingsRoomPageModule {}
