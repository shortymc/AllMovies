import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService, TitleService } from './../../../shared/shared.module';
import { User } from './../../../model/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  subs = [];

  constructor(
    private auth: AuthService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.auth.user$.subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.auth.getCurrentUser().then(u => this.user = u);
      }
    }));
    this.title.setTitle('title.profile');
  }

  changeLang(): void {
    this.auth.changeUser(this.user);
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
