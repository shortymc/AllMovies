import 'rxjs/add/observable/fromPromise';
import { Url } from './../constant/url';
import { DropboxService } from './dropbox.service';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {

  redirectUrl: string;

  constructor(private dropbox: DropboxService) { }

  getToken(): string {
    // console.log('getToken');
    return localStorage.getItem('token');
  }

  isAuthenticated(): Promise<boolean> {
    // console.log('isAuthenticated');
    const token = this.getToken();
    if (token) {
      // console.log('true');
      return new Promise((resolve) => { resolve(true); });
    } else {
      // console.log('false');
      return new Promise((resolve) => { resolve(false); });
    }
  }

  isAllowed(): Promise<boolean> {
    // console.log('isAuthenticated');
    const token = this.getToken();
    if (token) {
      // console.log('true');
      return this.checkInfos(token);
    } else {
      // console.log('false');
      return new Promise((resolve) => { resolve(false); });
    }
  }

  checkInfos(token: string): Promise<boolean> {
    // console.log('checkInfos');
    const user_infos = <User>jwtDecode(token);
    // console.log('token', user_infos);
    return this.getUserInfo(user_infos.id).then((user: User) => {
      // console.log('user', user);
      return user.name === user_infos.name && user.password === user_infos.password;
    });
  }

  getUserInfo(id: number): Promise<User> {
    // console.log('getUserInfo', id);
    return this.getUserFile().then((users: User[]) => {
      // console.log('users', users);
      return new Promise<User>((resolve, reject) => {
        resolve(users.find((user: User) => user.id === id));
      });
    });
  }

  getUserFile(): Promise<User[]> {
    // console.log('getUserFile');
    return this.dropbox.downloadFile(Url.DROPBOX_USER_FILE).then(file =>
      <User[]>JSON.parse(file)
    ).catch((error: any) => {
      console.error(error);
      return new Promise((resolve, reject) => { });
    });
  }

  logout() {

  }
}
