import { forkJoin } from 'rxjs/observable/forkJoin';
import { Directive, Input, HostListener } from '@angular/core';

import { Movie } from '../../model/movie';
import { MovieService } from '../service/movie.service';
import { DropboxService } from '../service/dropbox.service';
import { AuthService } from '../service/auth.service';

@Directive({
  selector: '[appAddCollection]'
})
export class AddCollectionDirective {
  @Input()
  movies: Movie[];
  @HostListener('click', ['$event']) onClick(): void {
    this.add();
  }

  constructor(private movieService: MovieService, private dropboxService: DropboxService, private auth: AuthService) { }

  add(): void {
    if (this.movies.length > 1) {
      this.movies = this.movies.filter((reco: Movie) => reco.checked);
    }
    this.addMovies();
  }

  addMovies(): void {
    const prom = [];
    this.movies.forEach(movie => {
      prom.push(this.movieService.getMovie(movie.id, false, false, false, false, false, false, false, 'fr'));
      prom.push(this.movieService.getMovie(movie.id, false, false, false, false, false, false, false, 'en'));
      movie.added = new Date();
    });
    forkJoin(prom).subscribe((movies: Movie[]) => {
      this.auth.getFileName().then((fileName) => {
        this.dropboxService.addMovieList(movies, fileName);
      });
    });
  }
}
