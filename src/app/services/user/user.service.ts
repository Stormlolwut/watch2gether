import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserResponse } from './../../user-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { AuthResponse } from '../../auth/auth-response';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private httpClient: HttpClient, private storage: Storage, private router: Router) {
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type',
    })
  };


  private serverURL(): string {
    return 'http://localhost:3000/';
  }

  private signUpURL(): string {
    return this.serverURL() + 'signup';
  }

  private loginURL(): string {
    return this.serverURL() + 'login';
  }

  private getAllUsersURL(): string {
    return this.serverURL() + 'users';
  }




  public getAllUsers(success: (response: UserResponse) => void, err: () => void): void {
    this.httpClient.get<UserResponse>(this.getAllUsersURL()).subscribe((response) => {
      success(response);
    },
      error => err());
  }

  public signUpUser(email: string, password: string, onSuccess: (token: AuthResponse) => void): void {
    this.httpClient.post<AuthResponse>(this.signUpURL(), { email: email, password: password }, this.httpOptions).subscribe((response) => {
      if (response.statusCode == 201) {
        this.SuccessLogin(response, onSuccess);
        return;
      }
    })
  }

  public login(email: string, password: string, onSuccess: (token: AuthResponse) => void): void {
    this.httpClient.post<AuthResponse>(this.loginURL(), { email: email, password: password }, this.httpOptions).subscribe((response) => {
      if (response.statusCode == 200) {
        this.SuccessLogin(response, onSuccess);
        return;
      }
    })
  }

  private async SuccessLogin(response: AuthResponse, onSuccess: (token: AuthResponse) => void) {
    await this.storage.set("ACCESS_TOKEN", response.user.token);

    onSuccess(response);
  }

  public async Logout(onSuccess: () => void) {
    await this.storage.remove("ACCESS_TOKEN");

    onSuccess();
  }
}
