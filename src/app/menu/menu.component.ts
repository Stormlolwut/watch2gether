import { Router } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public username: string = "";

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
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
  ];

  constructor(private userService: UserService, private router: Router) {
    setTimeout(() => {
      this.username = userService.Username;
    })
  }

  ngOnInit() { 
    console.log("test");
  }
}
