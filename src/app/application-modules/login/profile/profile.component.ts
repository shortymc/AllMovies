import { TitleService } from './../../../shared/shared.module';
import { User } from './../../../model/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/shared.module';

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

  ngOnInit() {
    this.auth.getCurrentUser().then(user => this.user = user);
    this.title.setTitle('title.profile');
  }

}
