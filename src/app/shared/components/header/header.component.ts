import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime
} from 'rxjs/operators';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { TitleService } from '../../service/title.service';
import { AuthService } from '../../service/auth.service';
import { Direction } from '../../../model/model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isHeaderVisible = true;
  faUser = faUser;

  constructor(
    public auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('');
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    const scroll$ = fromEvent(window, 'scroll')
      .pipe(
        throttleTime(10),
        map(() => window.pageYOffset),
        pairwise(),
        map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
        distinctUntilChanged(),
        share()
      );
    scroll$.pipe(
      filter(direction => direction === Direction.Up)
    ).subscribe(() => (this.isHeaderVisible = true));

    scroll$.pipe(
      filter(direction => direction === Direction.Down)
    ).subscribe(() => (this.isHeaderVisible = false));
  }

}
