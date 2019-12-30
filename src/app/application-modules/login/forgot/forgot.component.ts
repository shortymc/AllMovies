import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as crypto from 'crypto-js';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

import { ToastService, AuthService, TitleService, UtilsService } from './../../../shared/shared.module';
import { User } from './../../../model/user';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit, OnDestroy {
  @ViewChild('nameNext', { static: true }) nameNext: ElementRef;
  @ViewChild('answerNext', { static: true }) answerNext: ElementRef;
  @ViewChild('passwordNext', { static: true }) passwordNext: ElementRef;
  question: string;
  answer: string;
  name: string;
  messageName: string;
  messageAnswer: string;
  messagePassword: string;
  password1: string;
  password2: string;
  user: User;
  subs = [];
  faCheck = faCheck;

  constructor(
    private auth: AuthService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.login');
    this.subs.push(this.route.queryParams.subscribe(
      params => {
        this.name = params.name ? params.name : '';
      }));
  }

  loadQuestion(): void {
    this.question = '';
    this.auth.getUserByName(this.name).then(user => {
      if (user) {
        this.question = user.question;
        this.nameNext.nativeElement.click();
        this.messageName = undefined;
        this.user = user;
      } else {
        this.messageName = 'login.forgot.wrong_name';
        this.user = undefined;
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  forgot(): void {
    this.messageAnswer = undefined;
    this.auth.checkAnswer(this.name, crypto.SHA512(this.answer).toString()).then(correct => {
      if (correct) {
        this.answerNext.nativeElement.click();
      } else {
        this.messageAnswer = 'login.wrong_answer';
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  changePassword(): void {
    if (this.password1 !== this.password2) {
      this.messagePassword = 'login.error_password';
    } else {
      this.user.password = crypto.SHA512(this.password1).toString();
      this.auth.updateUser(this.user);
      this.passwordNext.nativeElement.click();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
