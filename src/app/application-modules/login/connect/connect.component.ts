import { TitleService } from './../../../shared/shared.module';
import { AuthService } from './../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  name: string;
  password: string;
  message: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.title.setTitle('title.login');
  }

  login() {
    if (this.name && this.password) {
      this.auth.login(this.name, crypto.SHA512(this.password).toString()).then((isAuth) => {
        if (isAuth) {
          this.message = this.translate.instant('login.connect.connected');
          this.router.navigateByUrl('/');
        } else {
          this.message = this.translate.instant('login.connect.wrong');
        }
      });
    }
  }

}
