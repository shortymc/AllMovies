import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  distinctUntilChanged,
} from 'rxjs/operators';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { MediaMatcher } from '@angular/cdk/layout';

import { TitleService } from '../../service/title.service';
import { AuthService } from '../../service/auth.service';
import { User } from '../../../model/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  user: User;
  faUser = faUser;
  faBars = faBars;
  isLogged$ = new BehaviorSubject<boolean>(false);
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private auth: AuthService,
    private title: TitleService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.title.setTitle('');
    this.auth.isLogged.pipe(distinctUntilChanged()).subscribe(isLogged => {
      this.isLogged$.next(isLogged);
      if (isLogged) {
        this.auth.getCurrentUser().then(user => this.user = user);
      } else {
        this.user = undefined;
      }
    });
  }

  logout(): void {
    this.user = undefined;
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
