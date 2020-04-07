import {Component, OnInit} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Platform} from '@ionic/angular';
import {RoomService} from '../../../../services/rooms/room.service';
import {UserService} from '../../../../services/user/user.service';
import {RoomSocketService} from '../../../../services/rooms/room-socket.service';
import {RoomUsersInfo} from '../../../../services/rooms/room-user-info';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {UserListInterface} from '../../../youtubePlayer/youtube-information';

@Component({
    selector: 'app-room-users',
    templateUrl: './room-users.component.html',
    styleUrls: ['./room-users.component.scss'],
})
export class RoomUsersComponent implements OnInit {
    public roomUsers: Array<UserListInterface> = [];

    constructor(private roomService: RoomService,
                private roomSocketService: RoomSocketService,
                public userService: UserService,
                private geolocation: Geolocation,
                private httpClient: HttpClient,
                private platform: Platform) {
        if (this.roomSocketService.onUserInfoReceived.length === 0)
            this.roomSocketService.onUserInfoReceived.push((users) => this.onUsersReceived(users))
    }

    ngOnInit() {
        if (this.platform.is('mobile')) {

            this.geolocation.getCurrentPosition().then((resp) => {
                const lat = resp.coords.latitude;
                const long = resp.coords.longitude;
                this.httpClient.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCALC3P1CaJEx7Fx8uzOXyov0VHAZJOxuo`).subscribe((response) => {
                    const countryCode = this.getCountry(response.results[0].address_components);
                    this.userService.countryCode = countryCode;
                    const userInfo = {
                        userName: this.userService.currentUser.user.id,
                        countryCode,
                        src: `https://www.countryflags.io/${countryCode}/flat/64.png`
                    };

                    this.roomSocketService.sendUserInformation(userInfo);
                });
            }).catch((error) => {
                console.log('Error getting location', error);
            });
        } else {
            this.roomService.getWebLocation().then(value => {
                this.userService.countryCode = value.country;
                const userInfo = {
                    userName: this.userService.currentUser.user.id,
                    countryCode: value.country,
                    src: `https://www.countryflags.io/${this.userService.countryCode}/flat/64.png`
                };
                this.roomSocketService.sendUserInformation(userInfo);
            }).catch(error => {
                console.log(error)
            });
        }
    }

    private getCountry(addrComponents) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < addrComponents.length; i++) {
            if (addrComponents[i].types[0] === 'country') {
                return addrComponents[i].short_name;
            }
            if (addrComponents[i].types.length === 2) {
                if (addrComponents[i].types[0] === 'political') {
                    return addrComponents[i].short_name;
                }
            }
        }
        return false;
    }

    public onUsersReceived(roomUserInfo: RoomUsersInfo) {
        this.roomUsers = [];
        const users = [];

        this.httpClient.get<any>(`${environment.serverURL}/rooms/${this.roomService.selectedRoom.id}/users`).subscribe((response) => {
            for (const user of response.users) {
                this.roomUsers.push({name: user.user, roles: user.roles, src: '', joined: false});
            }

            const userInfo = {
                userName: this.userService.currentUser.user.id,
                src: `https://www.countryflags.io/${this.userService.countryCode}/flat/64.png`,
            };

            users.push(userInfo);

            for (const user of roomUserInfo.users) {
                const username = user.userName;
                if (username !== this.userService.currentUser.user.id) {
                    users.push({
                        userName: user.userName,
                        src: `https://www.countryflags.io/${user.countryCode}/flat/64.png`,
                    });
                }
            }

            for (const user of users) {
                for (const roomUser of this.roomUsers) {
                    if (roomUser.name === user.userName) {
                        console.log(roomUser.name);
                        roomUser.src = user.src;
                        roomUser.joined = true;
                    }
                }
            }
        });
    }
}
