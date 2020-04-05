import { AuthResponse } from '../interfaces/auth-response';
import { UserService } from '../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public username = '';

  public home = {
    title: 'Home',
    url: '/',
    icon: 'home',
    selected: false
  };
  public rooms = {
    title: 'Rooms',
    url: '/rooms',
    icon: 'images',
    selected: false,
  };
  public logOut = {
    title: 'Logout',
    url: '/login',
    icon: 'arrow-undo',
  };

  constructor(
    private userService: UserService,
  ) {
    userService.OnUserInfoReceived.push((userInfo: AuthResponse) => {
      this.onUserInformationReceived(userInfo);
    });
  }

  onUserInformationReceived(userInfo: AuthResponse) {
    this.username = userInfo.user.id;
  }

  async logout(){
    await this.userService.Logout();
  }

  ngOnInit() {
    const path = window.location.pathname.split('/')[1];

    this.home.selected = this.home.url === path;
    this.rooms.selected = this.rooms.url === path;
  }
}
