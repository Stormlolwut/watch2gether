import {AuthResponse} from '../../interfaces/auth-response';
import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Storage} from '@ionic/storage';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient, private storage: Storage) {
        this.OnUserInfoReceived = new Array<(userInfo: AuthResponse) => void>();
        this.getUserInformation();
    }

    private readonly ACCESSTOKEN: string = 'ACCESS_TOKEN';

    public currentUser: AuthResponse;

    public OnUserInfoReceived: Array<(userInfo: AuthResponse) => void>

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type',
        })
    };

    public getToken(): Promise<string> {
        return this.storage.get(this.ACCESSTOKEN);
    }

    private getUserInformation() {
        this.httpClient.get<AuthResponse>(environment.serverURL, {}).subscribe((value) => {
                this.currentUser = value;
                this.OnUserInfoReceived?.forEach(element => {
                    element(value);
                });
            },
            error => {
                console.log(error);
            });
    }

    public getAllUsers(success: (response: AuthResponse) => void, err: () => void): void {
        this.httpClient.get<AuthResponse>(`${environment.serverURL}/users`).subscribe((response) => {
                success(response);
            },
            error => err());
    }

    public signUpUser(email: string, password: string, onSuccess: (token: AuthResponse) => void): void {
        this.httpClient.post<AuthResponse>(`${environment.serverURL}/signup`, {email, password}, this.httpOptions).subscribe((response) => {
            if (response.statusCode === 201) {
                this.SuccessLogin(response, onSuccess);
                return;
            }
        })
    }

    public login(email: string, password: string, onSuccess: (token: AuthResponse) => void): void {
        this.httpClient.post<AuthResponse>(`${environment.serverURL}/login`, {email, password}, this.httpOptions).subscribe((response) => {
            if (response.statusCode === 200) {
                this.SuccessLogin(response, onSuccess);

                this.OnUserInfoReceived?.forEach(element => {
                    element(response);
                });

                return;
            }
        })
    }

    private async SuccessLogin(response: AuthResponse, onSuccess: (token: AuthResponse) => void) {
        await this.storage.set(this.ACCESSTOKEN, response.user.token);

        onSuccess(response);
    }

    public async Logout(onSuccess?: () => void) {
        await this.storage.remove(this.ACCESSTOKEN);

        if (onSuccess) {
            onSuccess();
        }
    }

    public async UserHasLoggedIn(): Promise<boolean> {
        let loggedIn = false;
        await this.storage.get(this.ACCESSTOKEN).then((value) => {
            loggedIn = value != null;
        });

        return loggedIn;
    }
}
