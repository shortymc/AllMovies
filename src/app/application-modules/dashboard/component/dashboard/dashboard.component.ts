import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../../model/movie';
import { MovieService } from '../../../../service/movie.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getTopMovies(this.translate.currentLang);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getTopMovies(event.lang);
    });
  }

  getTopMovies(language: string) {
    this.movieService.getMovies(language)
      .then(movies => this.movies = movies.slice(0, 4));
  }
}
