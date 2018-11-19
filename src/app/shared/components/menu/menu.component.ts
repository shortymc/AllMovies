import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  distinctUntilChanged,
} from 'rxjs/operators';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavContent } from '@angular/material';

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
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('content') content: MatSidenavContent;
  @HostListener('document:click', ['$event']) onClick(event: Event): void {
    this.handleClick(event);
  }

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
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

  handleClick(event: any): void {
    let result = false;
    let clickedComponent = event.target;
    do {
      if (clickedComponent === this.content.getElementRef().nativeElement) {
        result = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (this.sidenav.opened && result) {
      this.sidenav.toggle();
    }
  }

  logout(): void {
    this.user = undefined;
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}