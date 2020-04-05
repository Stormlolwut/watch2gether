import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsRoomPage } from './settings-room.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoomPageRoutingModule {}
