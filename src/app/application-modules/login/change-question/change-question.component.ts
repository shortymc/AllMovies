import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as crypto from 'crypto-js';

import { User } from './../../../model/user';
import { AuthService, TitleService } from '../../../shared/shared.module';

@Component({
  selector: 'app-change-question',
  templateUrl: './change-question.component.html',
  styleUrls: ['./change-question.component.scss']
})
export class ChangeQuestionComponent implements OnInit, OnDestroy {
  oldQuestion: string;
  oldAnswer: string;
  newQuestion: string;
  newAnswer: string;
  message: string;
  user: User;
  subs = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private title: TitleService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.profile');
    this.subs.push(this.route.queryParams.subscribe(
      params => {
        this.auth.getUserByName(params.name).then((user) => {
          this.user = user;
          this.oldQuestion = user.question;
        });
      }));
  }

  change(): void {
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

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
