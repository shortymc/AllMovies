import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import * as crypto from 'crypto-js';

import {TitleService} from './../../../shared/shared.module';
import {User} from './../../../model/user';
import {AuthService} from '../../../shared/shared.module';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  oldPass!: string;
  pass1!: string;
  pass2!: string;
  message!: string;
  user!: User;
  subs: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private title: TitleService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('title.profile');
    this.subs.push(
      this.auth.user$.subscribe(user => {
        if (user) {
          this.user = user;
        }
      })
    );
  }

  change(): void {
    this.message = '';
    if (this.pass1 !== this.pass2) {
      this.message = 'login.error_password';
    } else if (crypto.SHA512(this.oldPass).toString() !== this.user.password) {
      this.message = 'login.change_password.wrong';
    } else {
      this.user.password = crypto.SHA512(this.pass1).toString();
      this.auth
        .updateUser(this.user)
        .then(() => this.router.navigate(['/login/profile']));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe());
  }
}
