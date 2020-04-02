import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomsPage } from './rooms.page';

const routes: Routes = [
  {
    path: '',
    component: RoomsPage
  },
  {
    path: 'room',
    loadChildren: () => import('./room/view-room/room.module').then(m => m.RoomPageModule)
  },
  {
    path: 'create-room',
    loadChildren: () => import('./room/create-room/create-room.module').then(m => m.CreateRoomPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsPageRoutingModule {}
