import { Router } from '@angular/router';
import 'rxjs/add/observable/fromPromise';
import { Url } from './../constant/url';
import { DropboxService } from './dropbox.service';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import * as jwtDecode from 'jwt-decode';
import * as KJUR from 'jsrsasign';
import { Utils } from '../shared/utils';
import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class AuthService {

  redirectUrl: string;
  isLogged = false;
  private fileName: string;

  constructor(private dropbox: DropboxService, private router: Router, private serviceUtils: ServiceUtils,
    private toast: ToastService, private translate: TranslateService) { }

  static usersToBlob(movies: User[]): any {
    const theJSON = JSON.stringify(movies);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static getUserFileName(id: number): string {
    return Url.DROPBOX_FILE_PREFIX + id + Url.DROPBOX_FILE_SUFFIX;
  }

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
      this.fileName = AuthService.getUserFileName(user_infos.id);
      this.isLogged = true;
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
      this.fileName = AuthService.getUserFileName(user_infos.id);
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
        this.fileName = AuthService.getUserFileName(found_users[0].id);
        return true;
      } else {
        this.isLogged = false;
        this.fileName = '';
        return false;
      }
    }).catch(this.serviceUtils.handlePromiseError);
  }

  checkInfos(token: string): Promise<boolean> {
    // console.log('checkInfos');
    const user_infos = <User>jwtDecode(token);
    // console.log('token', user_infos);
    return this.getUserById(user_infos.id).then((user: User) => {
      // console.log('user', user);
      if (!user) {
        return false;
      }
      return user.name === user_infos.name && user.password === user_infos.password;
    }).catch(this.serviceUtils.handlePromiseError);
  }

  getUserById(id: number): Promise<User> {
    // console.log('getUserInfo', id);
    return this.getUserFile().then((users: User[]) => {
      // console.log('users', users);
      return new Promise<User>((resolve, reject) => {
        resolve(users.find((user: User) => user.id === id));
      });
    }).catch(this.serviceUtils.handlePromiseError);
  }

  changePassword(name: string, password: string) {
    return this.dropbox.downloadFile(Url.DROPBOX_USER_FILE).then(file => {
      let users = <User[]>JSON.parse(file);
      const user = users.find(item => item.name === name);
      user.password = password;
      users = users.filter(item => item.name !== name);
      users.push(user);
      users.sort(Utils.compareObject);
      this.dropbox.uploadFile(AuthService.usersToBlob(users), Url.DROPBOX_USER_FILE)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.user_changed'));
        }).catch(this.serviceUtils.handleError);
      return user;
    }).catch(this.serviceUtils.handlePromiseError);
  }

  checkAnswer(name: string, answer: string): Promise<boolean> {
    return this.getUserByName(name).then((user: User) => {
      return user.name === name && user.answer === answer;
    }).catch(this.serviceUtils.handlePromiseError);
  }

  getUserByName(name: string): Promise<User> {
    return this.getUserFile().then((users: User[]) => {
      return new Promise<User>((resolve, reject) => {
        resolve(users.find((user: User) => user.name === name));
      });
    }).catch(this.serviceUtils.handlePromiseError);
  }

  getUserFile(): Promise<User[]> {
    // console.log('getUserFile');
    return this.dropbox.downloadFile(Url.DROPBOX_USER_FILE).then(file =>
      <User[]>JSON.parse(file)
    ).catch(this.serviceUtils.handlePromiseError);
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

  register(user: User) {
    this.addUser(user).then((result) => {
      this.fileName = AuthService.getUserFileName(result.id);
      this.dropbox.uploadNewFile([], this.fileName)
        .then(() => {
          this.setToken(this.createToken(result));
          this.isLogged = true;
          this.router.navigate(['/']);
        }).catch(this.serviceUtils.handlePromiseError);
    }).catch(this.serviceUtils.handleError);
  }

  changeUser(user: User) {
    return this.dropbox.downloadFile(Url.DROPBOX_USER_FILE).then(file => {
      let users = <User[]>JSON.parse(file);
      users = users.filter(item => item.name !== user.name);
      users.push(user);
      users.sort(Utils.compareObject);
      this.dropbox.uploadFile(AuthService.usersToBlob(users), Url.DROPBOX_USER_FILE)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.user_changed'));
        }).catch(this.serviceUtils.handleError);
      return user;
    }).catch(this.serviceUtils.handlePromiseError);
  }

  addUser(user: User): Promise<User> {
    return this.dropbox.downloadFile(Url.DROPBOX_USER_FILE).then(file => {
      const users = <User[]>JSON.parse(file);
      const idMax = Math.max(...users.map(item => item.id));
      user.id = idMax + 1;
      users.push(user);
      users.sort(Utils.compareObject);
      this.dropbox.uploadFile(AuthService.usersToBlob(users), Url.DROPBOX_USER_FILE)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.user_added'));
        }).catch(this.serviceUtils.handleError);
      return user;
    }).catch(this.serviceUtils.handlePromiseError);
  }

  getFileName(): Promise<string> {
    return this.isAllowed().then((isAuth) => {
      if (isAuth) {
        return this.fileName;
      } else {
        this.logout();
        return '';
      }
    }).catch(this.serviceUtils.handlePromiseError);
  }

  getCurrentUser(): Promise<User> {
    return this.isAllowed().then((isAuth) => {
      if (isAuth) {
        const token = this.getToken();
        const user_infos = <User>jwtDecode(token);
        return this.getUserByName(user_infos.name);
      } else {
        this.logout();
        return undefined;
      }
    }).catch(this.serviceUtils.handlePromiseError);
  }

  logout() {
    this.isLogged = false;
    this.fileName = '';
    this.removeToken();
    this.router.navigate(['/login']);
  }
}
