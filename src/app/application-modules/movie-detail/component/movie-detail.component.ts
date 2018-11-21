import { Link } from './../../../model/model';
import { TabsService } from './../../../shared/service/tabs.service';
import { Observable } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { faChevronCircleLeft, faImage, faBookmark } from '@fortawesome/free-solid-svg-icons';

import { TitleService } from './../../../shared/shared.module';
// import { AllocineService } from './../../../service/allocine.service';
import { DuckDuckGo } from './../../../constant/duck-duck-go';
import { MovieService } from '../../../shared/shared.module';
import { Movie } from '../../../model/movie';
import { Keyword, Genre, DropDownChoice } from '../../../model/model';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  movie$: Observable<Movie>;
  isImagesVisible = false;
  Url = DuckDuckGo;
  id: number;
  scrollTo: HTMLElement;

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
    public tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.movie$ = this.getMovie(this.id, this.translate.currentLang);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.movie$ = this.getMovie(this.id, event.lang);
    });
    this.movie$.subscribe((movie: Movie) => {
      this.title.setTitle(movie.title);
    });
    // this.allocine.allocine('movie', '143067').subscribe(response => console.log(response));
  }

  getMovie(id: number, language: string): Observable<Movie> {
    return this.movieService.getMovie(id, true, true, true, true, true, true, true, language);
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
}
