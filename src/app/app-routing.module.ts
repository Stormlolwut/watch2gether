import { RoomPageModule } from './rooms/room/view-room/room.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsPageModule)
  },
  {
    path: 'room',
    redirectTo: 'rooms'
  },
  {
    path: 'room/:id',
    loadChildren: () => import('./rooms/room/view-room/room.module').then(m => m.RoomPageModule)
  },
  {
    path: 'createRoom',
    loadChildren: () => import('./rooms/room/create-room/create-room.module').then(m => m.CreateRoomPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
