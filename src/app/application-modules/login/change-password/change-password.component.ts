import { User } from './../../../model/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  oldPass: string;
  pass1: string;
  pass2: string;
  message: string;
  user: User;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.getCurrentUser().then((user) => this.user = user);
  }

  change() {
    this.message = '';
    if (this.pass1 !== this.pass2) {
      this.message = 'login.error_password';
    } else if (crypto.SHA512(this.oldPass).toString() !== this.user.password) {
      this.message = 'login.change_password.wrong';
    } else {
      this.user.password = crypto.SHA512(this.pass1).toString();
      this.auth.changeUser(this.user);
      this.router.navigate(['/login/profile']);
    }
  }

}
