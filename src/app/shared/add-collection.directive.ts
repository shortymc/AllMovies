import { forkJoin } from 'rxjs/observable/forkJoin';
import { Movie } from './../model/movie';
import { Directive, Input, HostListener } from '@angular/core';
import { DropboxService } from '../service/dropbox.service';
import { MovieService } from '../service/movie.service';

@Directive({
  selector: '[appAddCollection]'
})
export class AddCollectionDirective {
  @Input('movies')
  movies: Movie[];
  @HostListener('click', ['$event']) onClick() {
    this.add();
  }

  constructor(private movieService: MovieService, private dropboxService: DropboxService) { }

  add(): void {
    if (this.movies.length > 1) {
      this.movies = this.movies.filter((reco: Movie) => reco.checked);
    }
    this.addMovies();
  }

  addMovies() {
    const prom = [];
    this.movies.forEach(movie => {
      prom.push(this.movieService.getMovie(movie.id, false, false, false, false, 'fr'));
      prom.push(this.movieService.getMovie(movie.id, false, false, false, false, 'en'));
      movie.added = new Date();
    });
    forkJoin(prom).subscribe((movies: Movie[]) => {
      this.dropboxService.addMovieList(movies, 'ex.json');
    });
  }
}