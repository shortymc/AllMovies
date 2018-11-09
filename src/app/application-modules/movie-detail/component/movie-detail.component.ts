import { Observable } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, AfterViewChecked, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { faChevronCircleLeft, faSave, faImage } from '@fortawesome/free-solid-svg-icons';

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
export class MovieDetailComponent implements OnInit, AfterViewChecked {
  movie$: Observable<Movie>;
  isImagesVisible = false;
  Url = DuckDuckGo;
  id: number;
  scrollTo: HTMLElement;

  faChevronCircleLeft = faChevronCircleLeft;
  faSave = faSave;
  faImage = faImage;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    private title: TitleService,
    private router: Router,
    private elemRef: ElementRef,
    private cdRef: ChangeDetectorRef,
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

  ngAfterViewChecked(): void {
    this.scrollTo = this.elemRef.nativeElement.querySelector('h2');
    this.cdRef.detectChanges();
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
