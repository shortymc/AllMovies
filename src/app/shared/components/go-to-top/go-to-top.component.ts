import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  throttleTime
} from 'rxjs/operators';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-go-to-top',
  templateUrl: './go-to-top.component.html',
  styleUrls: ['./go-to-top.component.scss']
})
export class GoToTopComponent implements OnInit, AfterViewInit {
  @ViewChild('goToTop') goToTop: HTMLFormElement;
  isVisible = false;
  faAngleUp = faAngleUp;

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
        map(() => window.pageYOffset > window.innerHeight / 3 && document.body.scrollHeight > window.innerHeight),
        distinctUntilChanged(),
        share()
      );
    scroll$.pipe(
      filter(direction => !direction)
    ).subscribe(() => {
      this.goToTop.nativeElement.classList.add('hidden');
      this.goToTop.nativeElement.classList.add('fadeOut');
      this.goToTop.nativeElement.classList.remove('fadeIn');
    });

    scroll$.pipe(
      filter(direction => direction)
    ).subscribe(() => {
      this.goToTop.nativeElement.classList.remove('hidden');
      this.goToTop.nativeElement.classList.remove('transparent');
      this.goToTop.nativeElement.classList.remove('fadeOut');
      this.goToTop.nativeElement.classList.add('fadeIn');
    });
  }

  onTop(): void {
    window.scrollTo(0, 0);
  }

}
