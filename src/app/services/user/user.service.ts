import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponse}  from './UserResponse';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type',
    })
  };

  private signUpURL(): string {
    return 'http://localhost:3000/signup';
  }

  private loginURL(): string {
    return 'http://localhost:3000/login';
  }

  public signUpUser(email: string, password: string, onSuccess: (token: string) => void): void {
    this.httpClient.post<UserResponse>(this.signUpURL(), { email: email, password: password }, this.httpOptions).subscribe((response) => {
      if (response.message == "ok") {
        onSuccess(response.token);
      }

      console.log(response);
    })
  }

  public login(email: string, password: string, onSuccess: (token: string) => void): void {
    this.httpClient.post<UserResponse>(this.loginURL(), { email: email, password: password }, this.httpOptions).subscribe((response) => {
      if (response.message == "ok") {
        onSuccess(response.token);
      }

      console.log(response);
    })
  }
}
