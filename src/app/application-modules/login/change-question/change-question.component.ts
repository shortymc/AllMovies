import { TitleService } from './../../../service/title.service';
import { User } from './../../../model/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-change-question',
  templateUrl: './change-question.component.html',
  styleUrls: ['./change-question.component.scss']
})
export class ChangeQuestionComponent implements OnInit {
  oldQuestion: string;
  oldAnswer: string;
  newQuestion: string;
  newAnswer: string;
  message: string;
  user: User;

  constructor(
    private auth: AuthService,
    private router: Router,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.title.setTitle('title.profile');
    this.auth.getCurrentUser().then((user) => {
      this.user = user;
      this.oldQuestion = user.question;
    });
  }

  change() {
    this.message = '';
    if (crypto.SHA512(this.oldAnswer).toString() !== this.user.answer) {
      this.message = 'login.wrong_answer';
    } else {
      this.user.question = this.newQuestion;
      this.user.answer = crypto.SHA512(this.newAnswer).toString();
      this.auth.changeUser(this.user);
      this.router.navigate(['/login/profile']);
    }
  }

}
