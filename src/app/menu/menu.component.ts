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

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/',
      icon: 'home'
    },
    {
      title: 'Rooms',
      url: '/rooms',
      icon: 'images'
    },
    // {
    //   title: 'Profile',
    //   url: '/profile',
    //   icon: 'person'
    // }
  ];

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

  ngOnInit() {
    const path = window.location.pathname.split('/')[1];

    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        page => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
