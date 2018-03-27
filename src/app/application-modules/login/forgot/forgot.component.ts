import { ServiceUtils } from './../../../service/serviceUtils';
import { AuthService } from './../../../service/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  @ViewChild('nameNext') nameNext: ElementRef;
  @ViewChild('answerNext') answerNext: ElementRef;
  @ViewChild('passwordNext') passwordNext: ElementRef;
  question: string;
  answer: string;
  name: string;
  messageName: string;
  messageAnswer: string;
  messagePassword: string;
  password1: string;
  password2: string;

  constructor(private auth: AuthService, private serviceUtils: ServiceUtils) { }

  ngOnInit() {
  }

  loadQuestion() {
    this.question = '';
    this.auth.getUserByName(this.name).then(user => {
      if (user) {
        this.question = user.question;
        this.nameNext.nativeElement.click();
        this.messageName = undefined;
      } else {
        this.messageName = 'login.forgot.wrong_name';
      }
    }).catch(this.serviceUtils.handleError);
  }

  forgot() {
    this.auth.checkAnswer(this.name, crypto.SHA512(this.answer).toString()).then(correct => {
      if (correct) {
        this.answerNext.nativeElement.click();
        this.messageAnswer = undefined;
      } else {
        this.messageAnswer = 'login.forgot.wrong_answer';
      }
    }).catch(this.serviceUtils.handleError);
  }

  changePassword() {
    if (this.password1 !== this.password2) {
      this.messagePassword = 'login.forgot.error_password';
    } else {
      this.auth.changePassword(this.name, crypto.SHA512(this.password1).toString());
      this.passwordNext.nativeElement.click();
    }
  }
}