import { Router } from '@angular/router';
import 'rxjs/add/observable/fromPromise';
import { Url } from './../constant/url';
import { DropboxService } from './dropbox.service';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import * as jwtDecode from 'jwt-decode';
import * as KJUR from 'jsrsasign';

@Injectable()
export class AuthService {

  redirectUrl: string;
  isLogged = false;
  private fileName: string;

  constructor(private dropbox: DropboxService, private router: Router) { }

  getToken(): string {
    // console.log('getToken');
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  setToken(token: string) {
    this.removeToken();
    localStorage.setItem('token', token);
  }

  reject(): Promise<boolean> {
    this.isLogged = false;
    this.fileName = '';
    return new Promise((resolve) => { resolve(false); });
  }

  isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return this.reject();
    }
    const user_infos = <User>jwtDecode(token);
    if (token && user_infos && user_infos.id) {
      this.isLogged = true;
      this.fileName = Url.DROPBOX_FILE_PREFIX + user_infos.id + Url.DROPBOX_FILE_SUFFIX;
      return new Promise((resolve) => { resolve(true); });
    } else {
      return this.reject();
    }
  }

  isAllowed(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return this.reject();
    }
    const user_infos = <User>jwtDecode(token);
    if (token && user_infos && user_infos.id) {
      this.isLogged = true;
      this.fileName = Url.DROPBOX_FILE_PREFIX + user_infos.id + Url.DROPBOX_FILE_SUFFIX;
      return this.checkInfos(token);
    } else {
      return this.reject();
    }
  }

  login(name: string, password: string): Promise<boolean> {
    return this.getUserFile().then((users: User[]) => {
      const found_users = users.filter((user: User) => user.name === name && user.password === password);
      if (found_users.length === 1) {
        this.setToken(this.createToken(found_users[0]));
        this.isLogged = true;
        this.fileName = Url.DROPBOX_FILE_PREFIX + found_users[0].id + Url.DROPBOX_FILE_SUFFIX;
        return true;
      } else {
        this.isLogged = false;
        this.fileName = '';
        return false;
      }
    });
  }

  checkInfos(token: string): Promise<boolean> {
    // console.log('checkInfos');
    const user_infos = <User>jwtDecode(token);
    // console.log('token', user_infos);
    return this.getUserInfo(user_infos.id).then((user: User) => {
      // console.log('user', user);
      if (!user) {
        return false;
      }
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

  createToken(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      password: user.password
    };
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(payload);
    return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, 'secret');
  }

  getFileName(): Promise<string> {
    return this.isAllowed().then((isAuth) => {
      if (isAuth) {
        return this.fileName;
      } else {
        this.logout();
        return undefined;
      }
    });
  }

  logout() {
    this.isLogged = false;
    this.removeToken();
    this.router.navigate(['/login']);
  }
}
