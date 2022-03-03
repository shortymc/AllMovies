import {Component, OnInit} from '@angular/core';
import * as crypto from 'crypto-js';
import {ActivatedRoute} from '@angular/router';

import {User} from '../../../model/user';
import {AuthService, TitleService} from '../../../shared/shared.module';
import {Lang} from '../../../model/model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  name: string;
  password: string;
  question: string;
  answer: string;
  message: string;
  lang: Lang;

  constructor(
    private auth: AuthService,
    private title: TitleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params.name ? params.name : '';
    });
  }

  register(): void {
    this.title.setTitle('title.login');
    this.message = undefined;
    if (this.name && this.password && this.question && this.answer) {
      this.auth.isUserExist(this.name).then(resp => {
        if (resp) {
          this.message = 'login.register.already_exist';
        } else {
          const user = new User(
            0,
            this.name,
            false,
            crypto.SHA512(this.password).toString(),
            this.question,
            crypto.SHA512(this.answer).toString(),
            this.lang
          );
          this.auth.register(user);
        }
      });
    }
  }
}
