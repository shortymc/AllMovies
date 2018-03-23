import { AuthService } from './../../../service/auth.service';
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
  constructor(private auth: AuthService, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
  }

  login() {
    // this.auth.isAllowed().then((resp) => console.log(resp));
    if (this.name && this.password) {
      this.auth.login(this.name, crypto.SHA512(this.password).toString()).then((isAuth) => {
        if (isAuth) {
          this.message = 'Connected !';
          this.router.navigateByUrl('/');
        } else {
          this.message = 'Wrong informations..';
        }
      });
    }
  }

}
