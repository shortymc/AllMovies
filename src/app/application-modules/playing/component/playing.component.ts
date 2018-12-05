import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { MenuService } from './../../../shared/service/menu.service';
import { DiscoverCriteria } from './../../../model/discover-criteria';
import { Discover } from './../../../model/discover';
import { MovieService, TitleService } from '../../../shared/shared.module';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit, OnDestroy {
  playing: Discover;
  page: PageEvent;
  criteria: DiscoverCriteria;
  nbChecked = 0;

  faBookmark = faBookmark;
  subs = [];

  constructor(
    private movieService: MovieService,
    private translate: TranslateService,
    private title: TitleService,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.playing');
    this.criteria = new DiscoverCriteria();
    this.page = new PageEvent();
    this.page.pageIndex = this.criteria.page ? this.criteria.page - 1 : 0;
    this.criteria.region = 'FR';
    this.criteria.language = this.translate.currentLang;
    this.search(true);
    this.subs.push(this.translate.onLangChange.subscribe((event) => {
      this.criteria.language = event;
      this.search(false);
    }));
  }

  search(initPagination: boolean): void {
    if (initPagination || !this.page) {
      this.page = new PageEvent();
      this.nbChecked = 0;
    }
    this.criteria.page = this.page.pageIndex + 1;
    this.movieService.getMoviesPlaying(this.criteria).then(result => {
      this.playing = result;
      this.menuService.scrollTo$.next(100);
    });
  }

  updateSize(): void {
    this.nbChecked = this.playing.movies.filter(movie => movie.checked).length;
  }

  initSelection(): void {
    this.playing.movies.forEach((movie) => movie.checked = false);
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
