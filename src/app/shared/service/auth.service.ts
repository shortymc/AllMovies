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

  constructor(
    private dropbox: DropboxService,
    private router: Router,
    private serviceUtils: UtilsService,
    private toast: ToastService,
    private translate: TranslateService,
  ) { }

  static usersToBlob(user: User[]): any {
    return new Blob([JSON.stringify(user)], { type: 'text/json' });
  }

  static decodeToken(): User {
    const token = localStorage.getItem('token');
    if (token && token.trim() !== '') {
      return jwtDecode(token);
    } else {
      return undefined;
    }
  }

  static setToken(token: string): void {
    localStorage.removeItem('token');
    localStorage.setItem('token', token);
  }

  static createToken(user: User): string {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    return KJUR.jws.JWS.sign('HS256', sHeader, JSON.stringify(user), 'secret');
  }

  private reject(loggout: boolean): Promise<User> {
    if (loggout) {
      this.logout();
    }
    return new Promise(resolve => resolve(undefined));
  }

  isAuthenticated(): Promise<User> {
    const user = this.user$.getValue();
    if (user && user.id) {
      return new Promise(resolve => resolve(user));
    } else {
      return this.reject(true);
    }
  }

  isAllowed(loggout: boolean): Promise<User> {
    const user = AuthService.decodeToken();
    if (user && user.id) {
      return this.getUserFile()
        .then(users => users.find(u => u.id === user.id))
        .then((found: User) => {
          if (user.name === found.name && user.password === found.password && user.answer === user.answer && user.id === found.id) {
            return user;
          } else {
            return this.reject(loggout);
          }
        }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
    } else {
      return this.reject(loggout);
    }
  }

  login(name: string, password: string): Promise<User> {
    return this.getUserFile().then((users: User[]) => {
      const found_user = users.find((user: User) => user.name === name && user.password === password);
      if (found_user) {
        this.user$.next(found_user);
        return found_user;
      } else {
        return this.reject(false);
      }
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
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
    return this.dropbox.downloadFile(Dropbox.DROPBOX_USER_FILE)
      .then(file => <User[]>JSON.parse(file))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  register(user: User): void {
    let addedUser;
    this.addUser(user).then((result) => {
      addedUser = result;
      return this.dropbox.uploadNewFile('[]', `${Dropbox.DROPBOX_TAG_FILE}${addedUser.id}${Dropbox.DROPBOX_FILE_SUFFIX}`);
    }).then(() => this.dropbox.uploadNewFile('', `${Dropbox.DROPBOX_MOVIE_FILE}${addedUser.id}${Dropbox.DROPBOX_FILE_SUFFIX}`))
      .then(() => {
        AuthService.setToken(AuthService.createToken(addedUser));
        this.user$.next(addedUser);
        this.router.navigate(['/']);
      }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  updateUser(user: User): Promise<User> {
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

  getCurrentUser(loggout: boolean): Promise<User> {
    return this.isAllowed(loggout).then((user) => {
      this.user$.next(user);
      return user;
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  logout(): void {
    sessionStorage.clear();
    this.user$.next(undefined);
    document.location.href = '/login';
  }
}
