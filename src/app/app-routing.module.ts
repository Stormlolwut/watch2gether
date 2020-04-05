import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {RoomGuard} from './guards/room.guard';
import {UserGuard} from './guards/user-guard.service';
import {CanDeactivateRoomGuard} from './guards/can-deactivate-room.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [UserGuard]
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
    canActivate: [UserGuard, RoomGuard],
    canDeactivate: [CanDeactivateRoomGuard],
  },
  {
    path: 'room/:id/settings',
    loadChildren: () => import('./rooms/room/settings-room/settings-room.module').then(m => m.SettingsRoomPageModule),
    canActivate: [UserGuard, RoomGuard],
    canDeactivate: [CanDeactivateRoomGuard],
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
  providers: [RoomGuard, UserGuard, CanDeactivateRoomGuard]
})
export class AppRoutingModule { }
