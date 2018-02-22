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
  showMovie = false;
  showPerson = false;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getMovies()
      .then(movies => this.movies = movies.slice(0, 4));
  }
}
