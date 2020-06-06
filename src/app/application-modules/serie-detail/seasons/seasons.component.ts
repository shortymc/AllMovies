import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { faPlus, faMinus, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { Constants } from './../../../constant/constants';
import { Utils } from './../../../shared/utils';
import { Season } from './../../../model/season';
import { ImageSize } from './../../../model/model';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit, OnChanges {
  @Input()
  serie: string;
  @Input()
  seasons: Season[] = [];
  overviewId: number;
  overview: string;
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
  imageSize = ImageSize;
  faChevronCircleRight = faChevronCircleRight;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnChanges(changes: SimpleChanges): void {
    this.serie = changes.serie ? changes.serie .currentValue : undefined;
    this.seasons = changes.seasons ? changes.seasons.currentValue.sort((a, b) => Utils.compare(a.seasonNumber, b.seasonNumber, true)) : undefined;
  }

  goToSeasonDetail(season: number): void {
    sessionStorage.setItem('serie', this.serie);
    sessionStorage.setItem('season_max', '' + this.seasons.length);
    this.router.navigate(['./' + season], { relativeTo: this.route });
  }

  setOverview(season: Season): void {
    if (!this.overviewId || !this.overview || (this.overviewId !== season.id && this.overview !== season.overview)) {
      this.overview = season.overview;
      this.overviewId = season.id;
    } else {
      this.overviewId = undefined;
      this.overview = undefined;
    }
  }
}
