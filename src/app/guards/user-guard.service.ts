import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserService} from '../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {

    constructor(private userService: UserService) {
    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const response  = await this.userService.getUserInformation();
        this.userService.currentUser = response;

        this.userService.OnUserInfoReceived?.forEach(element => {
            element(response);
        });
        return true;
    }

}
