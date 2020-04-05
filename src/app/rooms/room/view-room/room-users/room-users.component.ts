import {Component, OnInit} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Platform} from '@ionic/angular';
import {RoomService} from '../../../../services/rooms/room.service';
import {UserService} from '../../../../services/user/user.service';
import {RoomSocketService} from '../../../../services/rooms/room-socket.service';
import {RoomUsersInfo} from '../../../../services/rooms/room-user-info';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-room-users',
    templateUrl: './room-users.component.html',
    styleUrls: ['./room-users.component.scss'],
})
export class RoomUsersComponent implements OnInit {

    public users: Array<{ userName: string, countryCode: string, src: string }> = [];

    constructor(private roomService: RoomService,
                private roomSocketService: RoomSocketService,
                public userService: UserService,
                private geolocation: Geolocation,
                private httpClient: HttpClient,
                private platform: Platform) {
        if (this.roomSocketService.onUserInfoReceived.length === 0)
            this.roomSocketService.onUserInfoReceived.push((users) => this.onUsersReceived(users))
        if (this.roomSocketService.onRoomJoined.length !== 2)
            this.roomSocketService.onRoomJoined.push(() => this.onOtherUserJoined())
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
                        userName: this.userService.currentUser.user.name,
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
                    userName: this.userService.currentUser.user.name,
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
        this.users = [];

        const userInfo = {
            userName: this.userService.currentUser.user.name,
            countryCode: this.userService.countryCode,
            src: `https://www.countryflags.io/${this.userService.countryCode}/flat/64.png`
        };
        this.users.push(userInfo);

        for (const user of roomUserInfo.users) {
            const username = user.userName;
            if (username !== this.userService.currentUser.user.name) {
                this.users.push({
                    userName: user.userName,
                    countryCode: user.countryCode,
                    src: `https://www.countryflags.io/${user.countryCode}/flat/64.png`
                });
            }
        }
    }

    private onOtherUserJoined() {
    }
}
