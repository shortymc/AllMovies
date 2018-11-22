import { Component, OnInit, ElementRef } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { delay, filter, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { TabsService } from './../../service/tabs.service';
import { TitleService } from '../../service/title.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  title: string;
  faClose = faTimes;
  isLogged$ = new BehaviorSubject<boolean>(false);

  constructor(
    private titleService: TitleService,
    public tabsService: TabsService,
    private elemRef: ElementRef,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.auth.isLogged.pipe(distinctUntilChanged()).subscribe(isLogged => this.isLogged$.next(isLogged));
    this.titleService.header.subscribe(title => {
      this.tabsService.updateCurTabLabel(title);
    });
    this.tabsService.isSelectAfterAdding.pipe(delay(1000), filter(x => x)).subscribe(() => {
      const active = this.elemRef.nativeElement.querySelector('.mat-tab-label-active');
      if (active) {
        active.scrollIntoView(0);
      }
    });
  }

}
