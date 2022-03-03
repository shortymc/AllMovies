import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {delay, filter} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';

import {TabsService} from './../../service/tabs.service';
import {TitleService} from '../../service/title.service';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, OnDestroy {
  title!: string;
  faClose = faTimes;
  isLogged$ = new BehaviorSubject<boolean>(false);
  subs: Subscription[] = [];

  constructor(
    private titleService: TitleService,
    public tabsService: TabsService,
    private elemRef: ElementRef,
    private auth: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.auth.user$.subscribe(user => this.isLogged$.next(user !== undefined))
    );
    this.titleService.header.subscribe(title => {
      this.tabsService.updateCurTabLabel(title);
      this.cdRef.detectChanges();
    });
    this.tabsService.isSelectAfterAdding
      .pipe(
        delay(1000),
        filter(x => x)
      )
      .subscribe(() => {
        const active = this.elemRef.nativeElement.querySelector(
          '.mat-tab-label-active'
        );
        if (active) {
          active.scrollIntoView(0);
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
