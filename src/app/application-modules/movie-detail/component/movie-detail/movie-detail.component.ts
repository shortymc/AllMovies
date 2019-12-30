import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Location } from '@angular/common';
import { faChevronCircleLeft, faImage, faChevronCircleRight, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import { TitleService, MenuService, MyDatasService, MyTagsService, TabsService, MovieService } from './../../../../shared/shared.module';
import { Tag } from './../../../../model/tag';
import { DuckDuckGo } from './../../../../constant/duck-duck-go';
import { Movie } from '../../../../model/movie';
import { Keyword, Genre, DetailConfig } from '../../../../model/model';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id: number;
  @Input() config: DetailConfig;
  @Output() loaded = new EventEmitter<boolean>();
  movie: Movie;
  tags: Tag[];
  showTags = false;
  isImagesVisible = false;
  isDetail: boolean;
  showTitles = false;
  Url = DuckDuckGo;
  subs = [];

  faChevronCircleLeft = faChevronCircleLeft;
  faChevronCircleRight = faChevronCircleRight;
  faImage = faImage;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    private title: TitleService,
    private router: Router,
    public tabsService: TabsService,
    private menuService: MenuService,
    private myTagsService: MyTagsService,
    private myDatasService: MyDatasService<Movie>
  ) { }

  ngOnInit(): void {
    this.subs.push(this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        const idParam = +params.get('id');
        if (idParam && idParam !== 0) {
          this.id = idParam;
          this.isDetail = true;
          this.getMovie(this.id);
        }
      }
    }));
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.config.lang = event.lang;
      this.getMovie(this.id);
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      this.id = changes.id.currentValue ? changes.id.currentValue : this.id;
      this.isDetail = false;
    }
    this.getMovie(this.id);
  }

  getMovie(id: number): void {
    if (this.id && this.id !== 0) {
      this.loaded.emit(false);
      this.config = this.config === undefined ?
        new DetailConfig(true, true, true, true, true, true, true, true, false, this.translate.currentLang) : this.config;
      this.movieService.getMovie(id, this.config, true).then((movie) => {
        this.movie = movie;
        this.loaded.emit(true);
        if (this.isDetail) {
          this.title.setTitle(movie.title);
          this.menuService.scrollTo$.next(0);
        }
      });
      this.subs.push(combineLatest([this.myTagsService.myTags$, this.myDatasService.myMovies$])
        .pipe(filter(([tags, movies]) => tags !== undefined && movies !== undefined))
        .subscribe(([tags, movies]) => {
          this.tags = [];
          this.showTags = false;
          if (movies.map(m => m.id).includes(this.id)) {
            this.showTags = true;
            this.tags = tags.filter(t => t.datas.filter(d => d.movie).map(m => m.id).includes(this.id));
          }
        }));
    }
  }

  redirectGenreToDiscover(genre: Genre): void {
    this.router.navigate(['discover'], { queryParams: { genre: JSON.stringify([genre.id]) } });
  }

  redirectKeywordToDiscover(keyword: Keyword): void {
    this.router.navigate(['discover'], { queryParams: { keyword: JSON.stringify([keyword.id]) } });
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
