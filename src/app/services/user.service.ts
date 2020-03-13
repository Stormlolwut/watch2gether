import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  public signUpUser(): void {
    this.httpClient.post(this.signUpURL(), {}, this.httpOptions).subscribe((response) => {
      console.log(response);
    })
  }

  public login(): boolean {
    // TODO: http post om in te loggen.

    return true;
  }
}
