import { Component, OnInit, ElementRef } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { delay } from 'rxjs/operators';

import { TabsService } from './../../service/tabs.service';
import { TitleService } from '../../service/title.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  title: string;
  faClose = faTimes;

  constructor(
    private titleService: TitleService,
    public tabsService: TabsService,
    private elemRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.titleService.header.subscribe(title => {
      this.tabsService.updateCurTabLabel(title);
    });
    this.tabsService.links.pipe(delay(1000)).subscribe(() => {
      const active = this.elemRef.nativeElement.querySelector('.mat-tab-label-active');
      if (active) {
        active.scrollIntoView(0);
      }
    });
  }

}
