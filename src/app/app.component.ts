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

import { TitleService, AuthService } from './shared/shared.module';

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isHeaderVisible = true;

  constructor(
    public auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private title: TitleService
  ) {
  }

  ngOnInit() {
    this.title.setTitle('');
  }

  ngAfterViewInit() {
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
