import { Component, OnInit } from '@angular/core';

import { AuthService, TitleService } from './../../../shared/shared.module';
import { User } from './../../../model/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(
    private auth: AuthService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.auth.getCurrentUser().then(user => this.user = user);
    this.title.setTitle('title.profile');
  }

}
