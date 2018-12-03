import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { faChevronCircleLeft, faImage, faBookmark } from '@fortawesome/free-solid-svg-icons';

import { TitleService, MenuService } from './../../../shared/shared.module';
import { TabsService } from './../../../shared/service/tabs.service';
// import { AllocineService } from './../../../service/allocine.service';
import { DuckDuckGo } from './../../../constant/duck-duck-go';
import { MovieService } from '../../../shared/shared.module';
import { Movie } from '../../../model/movie';
import { Keyword, Genre, DropDownChoice, MovieDetailConfig } from '../../../model/model';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  @Input()
  config: MovieDetailConfig;
  movie: Movie;
  isImagesVisible = false;
  Url = DuckDuckGo;
  id: number;
  subs = [];

  faChevronCircleLeft = faChevronCircleLeft;
  faBookmark = faBookmark;
  faImage = faImage;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    private title: TitleService,
    private router: Router,
    public tabsService: TabsService,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.getMovie(this.id, this.translate.currentLang);
    });
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getMovie(this.id, event.lang);
    }));
    // this.allocine.allocine('movie', '143067').subscribe(response => console.log(response));
  }

  getMovie(id: number, language: string): void {
    this.config = this.config === undefined ? new MovieDetailConfig(true, true, true, true, true, true) : this.config;
    this.movieService.getMovie(id, this.config, true, language).then((movie) => {
      this.title.setTitle(movie.title);
      this.movie = movie;
      this.menuService.scrollTo$.next(0);
    });
  }

  redirectGenreToDiscover(genre: Genre): void {
    sessionStorage.setItem('genre', JSON.stringify([new DropDownChoice(genre.name, genre.id)]));
    this.router.navigate(['discover']);
  }

  redirectKeywordToDiscover(keyword: Keyword): void {
    sessionStorage.setItem('keyword', JSON.stringify([keyword]));
    this.router.navigate(['discover']);
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
