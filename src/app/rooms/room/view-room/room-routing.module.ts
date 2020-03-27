import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomPage } from './room.page';

const routes: Routes = [
  {
    path: '',
    component: RoomPage
  },
  {
    path: 'create-room',
    loadChildren: () => import('../create-room/create-room.module').then(m => m.CreateRoomPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomPageRoutingModule {}
