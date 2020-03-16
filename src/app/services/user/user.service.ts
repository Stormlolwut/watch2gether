import { Router } from '@angular/router';
import { UserResponse } from './../../user-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { AuthResponse } from '../../auth/auth-response';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userToken: string;

  constructor(private httpClient: HttpClient, private storage: Storage, private router: Router) {
    storage.get("ACCESS_TOKEN").then((value) => {
      this.userToken = value;
    });
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




  private handleError(error: HttpErrorResponse) {
    console.log(error);

    if (error.status == 401) {
      console.log("Not Authorized");
    }

    this.router.navigate(["login"]);
  }

  public clientHasToken(): boolean {
    return this.userToken != null;
  }

  public getAllUsers(success: (response: UserResponse) => void, error: () => void): void {
    this.httpClient.get<UserResponse>(this.getAllUsersURL(), this.getHeaderAuthToken()).subscribe((response) => {
      console.log(response);
    },
      error => this.handleError(error));
  }

  public signUpUser(email: string, password: string, onSuccess: (token: AuthResponse) => void): void {
    this.httpClient.post<AuthResponse>(this.signUpURL(), { email: email, password: password }, this.httpOptions).subscribe((response) => {
      if (response.statusCode == 201) {
        this.SuccessLogin(response, onSuccess);
        return;
      }

      console.log(response);
    })
  }

  public login(email: string, password: string, onSuccess: (token: AuthResponse) => void): void {
    this.httpClient.post<AuthResponse>(this.loginURL(), { email: email, password: password }, this.httpOptions).subscribe((response) => {
      if (response.statusCode == 200) {
        this.SuccessLogin(response, onSuccess);
        return;
      }

      console.log(response);
    })
  }

  private async SuccessLogin(response: AuthResponse, onSuccess: (token: AuthResponse) => void) {
    await this.storage.set("ACCESS_TOKEN", response.user.token);
    await this.storage.set("EXPIRES_IN", 100000);

    this.userToken = response.user.token;

    onSuccess(response);
  }

  public async Logout(onSuccess: () => void) {
    await this.storage.remove("ACCESS_TOKEN");
    await this.storage.remove("EXPIRES_IN");

    onSuccess();
  }

  private getHeaderAuthToken(): object {
    const headers = new HttpHeaders({
      'Authorization': 'BEARER ' + this.userToken,
    })

    return { headers }
  }
}
