import { forkJoin } from 'rxjs';
import { Directive, Input, HostListener } from '@angular/core';

import { Movie } from '../../model/movie';
import { MovieService } from '../service/movie.service';
import { MyMoviesService } from './../service/my-movies.service';
import { AuthService } from '../service/auth.service';
import { MovieDetailConfig } from '../../model/model';

@Directive({
  selector: '[appAddCollection]'
})
export class AddCollectionDirective {
  @Input()
  movies: Movie[];
  @HostListener('click', ['$event']) onClick(): void {
    this.add();
  }

  constructor(
    private movieService: MovieService,
    private myMoviesService: MyMoviesService,
    private auth: AuthService
  ) { }

  add(): void {
    if (this.movies.length > 1) {
      this.movies = this.movies.filter((mov: Movie) => mov.checked);
    }
    this.addMovies();
  }

  addMovies(): void {
    const prom = [];
    this.movies.forEach(movie => {
      prom.push(this.movieService.getMovie(movie.id, new MovieDetailConfig(false, false, false, false, false, false), false, 'fr'));
      prom.push(this.movieService.getMovie(movie.id, new MovieDetailConfig(false, false, false, false, false, false), false, 'en'));
      movie.added = new Date();
    });
    forkJoin(prom).subscribe((movies: Movie[]) => {
      this.auth.getFileName().then((fileName) => {
        this.myMoviesService.add(movies, fileName);
      });
    });
  }
}
