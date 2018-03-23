import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import * as crypto from 'crypto-js';
import { User } from '../../../model/user';

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

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  register() {
    if (this.name && this.password && this.question && this.answer) {
      const user = new User(0, this.name, crypto.SHA512(this.password).toString(), this.question, crypto.SHA512(this.answer).toString());
      this.auth.register(user);
    }
  }

}
