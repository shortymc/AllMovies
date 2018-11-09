import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime
} from 'rxjs/operators';
import { Direction } from '../../../model/model';

@Component({
  selector: 'app-go-to-top',
  templateUrl: './go-to-top.component.html',
  styleUrls: ['./go-to-top.component.scss']
})
export class GoToTopComponent implements OnInit, AfterViewInit {
  @ViewChild('goToTop') goToTop: HTMLFormElement;
  @Input() top: HTMLElement;
  isVisible = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
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
    ).subscribe(() => {
      this.goToTop.nativeElement.classList.add('hidden');
      this.goToTop.nativeElement.classList.add('fadeOut');
      this.goToTop.nativeElement.classList.remove('fadeIn');
    });

    scroll$.pipe(
      filter(direction => direction === Direction.Down)
      ).subscribe(() => {
        this.goToTop.nativeElement.classList.remove('hidden');
        this.goToTop.nativeElement.classList.remove('transparent');
        this.goToTop.nativeElement.classList.remove('fadeOut');
        this.goToTop.nativeElement.classList.add('fadeIn');
    });
  }

  onTop(): void {
    this.top.scrollIntoView();
  }

}
