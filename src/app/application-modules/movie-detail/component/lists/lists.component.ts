import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { faPlus, faMinus, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { Constants } from './../../../../constant/constants';
import { Utils } from './../../../../shared/utils';
import { ListService } from './../../../../shared/shared.module';
import { List } from './../../../../model/model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnChanges {
  @Input() id: number;
  overviewId: number;
  overview: string;
  showLists = false;
  lists: List[] = [];
  swiperConfig: SwiperConfigInterface = {
    a11y: true,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    pagination: false,
    centeredSlides: false,
    zoom: false,
    touchEventsTarget: 'wrapper'
  };
  faChevronCircleRight = faChevronCircleRight;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private listService: ListService,
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Constants.MEDIA_MAX_700,
      Constants.MEDIA_MAX_1400])
      .subscribe(result => {
        this.swiperConfig.direction = result.breakpoints[Constants.MEDIA_MAX_700] ? 'vertical' : 'horizontal';
        if (result.breakpoints[Constants.MEDIA_MAX_1400] && result.breakpoints[Constants.MEDIA_MAX_700]) {
          this.swiperConfig.slidesPerView = 1;
        } else if (result.breakpoints[Constants.MEDIA_MAX_1400] && !result.breakpoints[Constants.MEDIA_MAX_700]) {
          this.swiperConfig.slidesPerView = 4;
        } else {
          this.swiperConfig.slidesPerView = 8;
        }
      });
  }

  getLists(): void {
    this.showLists = false;
    this.listService.getDataLists(this.id, this.translate.currentLang).then((lists: List[]) => {
      this.showLists = true;
      console.log('list', lists);
      this.lists = lists.sort((a, b) => Utils.compare(a.id, b.id, true));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      this.id = changes.id.currentValue;
      this.showLists = false;
      this.lists = [];
    }
  }
}
