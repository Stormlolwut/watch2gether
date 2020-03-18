import { UserResponse } from './../user-response';
import { Router } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    
  }
  
//   async presentAlert(status, reason) {
//     const alert = await this.toastController.create({
//         header: status + ' Error',
//         message: reason,
//         buttons: ['OK'],
//         duration: 2000
//     });

//     await alert.present();
// }
  private onLoggedOut(): void {

  }
}
