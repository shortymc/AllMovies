import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { TabsService } from './../../service/tabs.service';
import { TitleService } from '../../service/title.service';
import { Link } from './../../../model/model';

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
    public tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this.titleService.header.subscribe(title => {
      this.title = title;
    });
  }

}
