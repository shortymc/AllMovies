import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { TitleService, PersonService } from './../../../../shared/shared.module';
import { Movie } from '../../../../model/movie';
import { MovieService } from '../../../../shared/shared.module';
import { Person } from '../../../../model/person';
import { Url } from '../../../../constant/url';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  persons: Person[] = [];
  swiperConfig: SwiperConfigInterface = {
    a11y: true,
    keyboard: true,
    mousewheel: true,
    slidesPerView: 5,
    scrollbar: false,
    navigation: true,
    pagination: false,
    centeredSlides: false,
    zoom: false,
    slideToClickedSlide: true,
    touchEventsTarget: 'wrapper'
  };
  subs = [];
  Url = Url;

  constructor(
    private movieService: MovieService,
    private personService: PersonService,
    private translate: TranslateService,
    private title: TitleService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('');
    this.getTopMovies(this.translate.currentLang);
    this.getToPersons(this.translate.currentLang);
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getTopMovies(event.lang);
      this.getToPersons(event.lang);
    }));
    this.breakpointObserver.observe(['(max-width: 700px)'])
      .subscribe(result => {
        this.swiperConfig.direction = result.breakpoints['(max-width: 700px)'] ? 'vertical' : 'horizontal';
      });
  }

  getTopMovies(language: string): void {
    this.movieService.getPopularMovies(language)
      .then(movies => this.movies = movies);
  }

  getToPersons(language: string): void {
    this.personService.getPopularPersons(language)
      .then(persons => this.persons = persons);
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
