import { UserService } from '../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public canShowLogoutButton = false;

  constructor(private userService: UserService) {
    userService.UserHasLoggedIn().then((value) => {
      this.canShowLogoutButton = value;
    });
  }

  ngOnInit() {

  }

  public logout(): void {
    this.userService.Logout();
  }
}
