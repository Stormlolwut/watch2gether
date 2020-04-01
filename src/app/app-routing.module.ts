import { RoomPageModule } from './rooms/room/view-room/room.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {RoomGuard} from './guards/room.guard';
import {UserGuard} from './guards/user-guard.service';


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
    loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'room',
    redirectTo: 'rooms'
  },
  {
    path: 'room/:id',
    loadChildren: () => import('./rooms/room/view-room/room.module').then(m => m.RoomPageModule),
    canActivate: [RoomGuard]
  },
  {
    path: 'createRoom',
    loadChildren: () => import('./rooms/room/create-room/create-room.module').then(m => m.CreateRoomPageModule),
    canActivate: [UserGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [RoomGuard, UserGuard]
})
export class AppRoutingModule { }
