import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  throttleTime
} from 'rxjs/operators';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-go-to-top',
  templateUrl: './go-to-top.component.html',
  styleUrls: ['./go-to-top.component.scss']
})
export class GoToTopComponent implements OnInit, AfterViewInit {
  @ViewChild('goToTop', { static: true }) goToTop: MatButton;
  isVisible = false;
  faAngleUp = faAngleUp;

  constructor(
    private cdRef: ChangeDetectorRef,
    private elemRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    const scroll$ = fromEvent(this.elemRef.nativeElement.parentNode, 'scroll')
      .pipe(
        throttleTime(10),
        map((x: any) => x.target.scrollTop > (x.target.scrollHeight - x.target.offsetHeight) / 5 &&
          (x.target.scrollHeight - x.target.offsetHeight) > x.target.offsetHeight),
        distinctUntilChanged(),
        share()
      );
    scroll$.pipe(
      filter(direction => !direction)
    ).subscribe(() => {
      this.goToTop._elementRef.nativeElement.classList.add('hidden');
      this.goToTop._elementRef.nativeElement.classList.add('fadeOut');
      this.goToTop._elementRef.nativeElement.classList.remove('fadeIn');
    });

    scroll$.pipe(
      filter(direction => direction)
    ).subscribe(() => {
      this.goToTop._elementRef.nativeElement.classList.remove('hidden');
      this.goToTop._elementRef.nativeElement.classList.remove('transparent');
      this.goToTop._elementRef.nativeElement.classList.remove('fadeOut');
      this.goToTop._elementRef.nativeElement.classList.add('fadeIn');
    });
  }

  onTop(): void {
    this.elemRef.nativeElement.parentNode.scrollTo(0, 0);
  }

}
