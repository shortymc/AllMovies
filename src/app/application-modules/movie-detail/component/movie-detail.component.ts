import { TitleService } from './../../../service/title.service';
// import { AllocineService } from './../../../service/allocine.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Url } from './../../../constant/url';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../../../service/movie.service';
import { Movie } from '../../../model/movie';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  movie$: Observable<Movie>;
  isImagesVisible = false;
  Url = Url;
  id: number;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    private title: TitleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.movie$ = this.route.paramMap.switchMap((params: ParamMap) => {
      this.id = +params.get('id');
      return this.getMovie(this.id, this.translate.currentLang);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.movie$ = this.getMovie(this.id, event.lang);
    });
    this.movie$.subscribe(movie => this.title.setTitle(movie.title));
    // this.allocine.allocine('movie', '143067').subscribe(response => console.log(response));
  }

  getMovie(id: number, language: string): Observable<Movie> {
    return this.movieService.getMovie(id, true, true, true, true, language);
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }
}
