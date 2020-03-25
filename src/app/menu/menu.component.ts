import { MenuController } from "@ionic/angular";
import { AuthResponse } from "./../interfaces/auth-response";
import { Router } from "@angular/router";
import { UserService } from "./../services/user/user.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  public username: string = "";

  public selectedIndex = 0;
  public appPages = [
    {
      title: "Home",
      url: "/",
      icon: "home"
    },
    {
      title: "Rooms",
      url: "/rooms",
      icon: "images"
    },
    {
      title: "Profile",
      url: "/profile",
      icon: "person"
    }
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private menuController: MenuController
  ) {
    userService.OnUserInfoReceived.push((userInfo: AuthResponse) => {
      this.onUserInformationReceived(userInfo);
    });
  }

  onUserInformationReceived(userInfo: AuthResponse) {
    this.username = userInfo.user.name;
  }

  ngOnInit() {
    this.menuController.getMenus().then(value => {
      console.log(value);
    });
    const path = window.location.pathname.split("/")[1];

    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        page => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
