import { throwError } from 'rxjs';
import { AuthResponse } from './../../interfaces/auth-response';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { UserResponse } from './../../user-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public RedirectUrl: string;

  private readonly ACCESSTOKEN: string = "ACCESS_TOKEN";
  private readonly USERNAME: string = "USERNAME";

  public Username: string = "";

  public OnUserInfoReceived: [(userInfo: UserResponse) => void]

  constructor(private httpClient: HttpClient, private storage: Storage) {
    storage.get(this.USERNAME).then((value) => {
      this.Username = value;
    });
  }

  private getUserInformation() {
    this.httpClient.get<UserResponse>(environment.serverURL, {}).subscribe((value) => {
      console.log(value)
      this.OnUserInfoReceived.forEach(element => {
        element(value);
      }),
        error => { console.log(error); }
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
    return environment.serverURL;
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
    await this.storage.set(this.ACCESSTOKEN, response.user.token);
    await this.storage.set(this.USERNAME, response.user.name);

    onSuccess(response);
  }

  public async Logout(onSuccess?: () => void) {
    await this.storage.remove(this.ACCESSTOKEN);

    if (onSuccess) {
      onSuccess();
    }
  }

  public async UserHasLoggedIn(): Promise<boolean> {
    var loggedIn: boolean = false;
    await this.storage.get(this.ACCESSTOKEN).then((value) => {
      loggedIn = value != null;
    })

    return loggedIn;
  }
}
