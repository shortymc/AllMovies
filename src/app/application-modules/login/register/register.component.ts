import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/shared.module';
import * as crypto from 'crypto-js';
import { User } from '../../../model/user';
import { TitleService } from '../../../shared/shared.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string;
  password: string;
  question: string;
  answer: string;
  message: string;

  constructor(
    private auth: AuthService,
    private title: TitleService
  ) { }

  ngOnInit() {
  }

  register() {
    this.title.setTitle('title.login');
    this.message = undefined;
    if (this.name && this.password && this.question && this.answer) {
      this.auth.isUserExist(this.name).then((resp) => {
        if (resp) {
          this.message = 'login.register.already_exist';
        } else {
          const user = new User(0, this.name, crypto.SHA512(this.password).toString(), this.question, crypto.SHA512(this.answer).toString());
          this.auth.register(user);
        }
      });
    }
  }

}
