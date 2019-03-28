import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import * as KJUR from 'jsrsasign';
import { TranslateService } from '@ngx-translate/core';

import { DropboxService } from './dropbox.service';
import { ToastService } from './toast.service';
import { Level } from './../../model/model';
import { UtilsService } from './utils.service';
import { Utils } from '../utils';
import { Dropbox } from '../../constant/dropbox';
import { User } from '../../model/user';

@Injectable()
export class AuthService {
  user$: BehaviorSubject<User> = new BehaviorSubject(undefined);
  isLogged = new BehaviorSubject<boolean>(false);

  constructor(
    private dropbox: DropboxService,
    private router: Router,
    private serviceUtils: UtilsService,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  static decodeToken(token: string): User {
    let tkn = token;
    if (!tkn || tkn.trim() === '') {
      tkn = AuthService.getToken();
    }
    if (tkn && tkn.trim() !== '') {
      return jwtDecode(tkn);
    } else {
      return undefined;
    }
  }

  static usersToBlob(movies: User[]): any {
    return new Blob([JSON.stringify(movies)], { type: 'text/json' });
  }

  static getToken(): string {
    // console.log('getToken');
    return localStorage.getItem('token');
  }

  static removeToken(): void {
    localStorage.removeItem('token');
  }

  static setToken(token: string): void {
    this.removeToken();
    localStorage.setItem('token', token);
  }

  reject(): Promise<boolean> {
    this.isLogged.next(false);
    return new Promise((resolve) => { resolve(false); });
  }

  isAuthenticated(): Promise<boolean> {
    const token = AuthService.getToken();
    if (!token) {
      return this.reject();
    }
    const user_infos: User = AuthService.decodeToken(token);
    if (token && user_infos && user_infos.id) {
      this.isLogged.next(true);
      return new Promise((resolve) => { resolve(true); });
    } else {
      return this.reject();
    }
  }

  isAllowed(): Promise<boolean> {
    const token: string = AuthService.getToken();
    if (!token) {
      return this.reject();
    }
    const user_infos: User = AuthService.decodeToken(token);
    if (token && user_infos && user_infos.id) {
      this.isLogged.next(true);
      return this.checkInfos(token);
    } else {
      return this.reject();
    }
  }

  login(name: string, password: string): Promise<boolean> {
    return this.getUserFile().then((users: User[]) => {
      const found_users = users.filter((user: User) => user.name === name && user.password === password);
      if (found_users.length === 1) {
        sessionStorage.clear();
        AuthService.setToken(this.createToken(found_users[0]));
        this.isLogged.next(true);
        this.user$.next(found_users[0]);
        return true;
      } else {
        this.isLogged.next(false);
        this.user$.next(undefined);
        return false;
      }
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  checkInfos(token: string): Promise<boolean> {
    const user_infos: User = AuthService.decodeToken(token);
    return this.getUserById(user_infos.id).then((user: User) => {
      if (!user) {
        return false;
      }
      return user.name === user_infos.name && user.password === user_infos.password;
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getUserById(id: number): Promise<User> {
    return this.getUserFile()
      .then((users: User[]) => new Promise<User>((resolve, reject) => resolve(users.find((user: User) => user.id === id))))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  changePassword(name: string, password: string): Promise<User> {
    return this.dropbox.downloadFile(Dropbox.DROPBOX_USER_FILE).then(file => {
      let users = <User[]>JSON.parse(file);
      const user = users.find(item => item.name === name);
      user.password = password;
      users = users.filter(item => item.name !== name);
      users.push(user);
      users.sort(Utils.compareObject);
      this.dropbox.uploadFile(AuthService.usersToBlob(users), Dropbox.DROPBOX_USER_FILE)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.user_changed'), Level.success);
        }).catch((err) => this.serviceUtils.handleError(err, this.toast));
      this.user$.next(user);
      return user;
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  checkAnswer(name: string, answer: string): Promise<boolean> {
    return this.getUserByName(name).then((user: User) => {
      return user.name === name && user.answer === answer;
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getUserByName(name: string): Promise<User> {
    return this.getUserFile().then((users: User[]) => {
      return new Promise<User>((resolve, reject) => {
        resolve(users.find((user: User) => user.name === name));
      });
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  isUserExist(name: string): Promise<boolean> {
    return this.getUserFile().then(users => users.find(user => user.name === name) !== undefined
    ).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getUserFile(): Promise<User[]> {
    // console.log('getUserFile');
    return this.dropbox.downloadFile(Dropbox.DROPBOX_USER_FILE).then(file =>
      <User[]>JSON.parse(file)
    ).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  createToken(user: User): string {
    const payload = {
      id: user.id,
      name: user.name,
      lang: user.lang,
      password: user.password
    };
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(payload);
    return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, 'secret');
  }

  register(user: User): void {
    let addedUser;
    this.addUser(user).then((result) => {
      addedUser = result;
      return this.dropbox.uploadNewFile('', `${Dropbox.DROPBOX_TAG_FILE}${addedUser.id}${Dropbox.DROPBOX_FILE_SUFFIX}`);
    }).then(() => this.dropbox.uploadNewFile('', `${Dropbox.DROPBOX_MOVIE_FILE}${addedUser.id}${Dropbox.DROPBOX_FILE_SUFFIX}`))
      .then(() => {
        AuthService.setToken(this.createToken(addedUser));
        this.isLogged.next(true);
        this.router.navigate(['/']);
      }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  changeUser(user: User): Promise<User> {
    return this.dropbox.downloadFile(Dropbox.DROPBOX_USER_FILE).then(file => {
      let users = <User[]>JSON.parse(file);
      users = users.filter(item => item.name !== user.name);
      users.push(user);
      users.sort(Utils.compareObject);
      this.dropbox.uploadFile(AuthService.usersToBlob(users), Dropbox.DROPBOX_USER_FILE)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.user_changed'), Level.success);
        }).catch((err) => this.serviceUtils.handleError(err, this.toast));
      this.user$.next(user);
      return user;
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  addUser(user: User): Promise<User> {
    return this.dropbox.downloadFile(Dropbox.DROPBOX_USER_FILE).then(file => {
      const users = <User[]>JSON.parse(file);
      const idMax = Math.max(...users.map(item => item.id));
      user.id = idMax + 1;
      users.push(user);
      users.sort(Utils.compareObject);
      this.dropbox.uploadFile(AuthService.usersToBlob(users), Dropbox.DROPBOX_USER_FILE)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.user_added'), Level.success);
        }).catch((err) => this.serviceUtils.handleError(err, this.toast));
      return user;
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getCurrentUser(): Promise<User> {
    return this.isAllowed().then((isAuth) => {
      if (isAuth) {
        return AuthService.decodeToken(AuthService.getToken());
      } else {
        this.logout();
        return undefined;
      }
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getProfile(): Promise<User> {
    return this.isAllowed().then((isAuth) => {
      if (isAuth) {
        return this.getUserByName(AuthService.decodeToken(AuthService.getToken()).name);
      } else {
        this.logout();
        return undefined;
      }
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  logout(): void {
    this.isLogged.next(false);
    AuthService.removeToken();
    sessionStorage.clear();
    this.user$.next(undefined);
    this.router.navigate(['/login']);
  }
}
