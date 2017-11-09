import { Component, OnInit } from '@angular/core';
import { Movie } from './movie';
import { MovieService } from './movie.service';
import { Router } from '@angular/router';

@Component({
    selector: 'my-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.css']
})

export class MoviesComponent implements OnInit {
    movies: Movie[];
    selectedMovie: Movie;
    constructor(private movieService: MovieService, private router: Router) { }
    getMovies(): void {
        this.movieService.getMovies().then(movies => this.movies = movies);
    }
    ngOnInit(): void {
        this.getMovies();
    }
    onSelect(movie: Movie): void {
        this.selectedMovie = movie;
    };
    gotoDetail(): void {
        this.router.navigate(['/detail', this.selectedMovie.id]);
    }
    add(name: string): void {
        name = name.trim();
        if (!name) { return; }
        this.movieService.create(name)
            .then(movie => {
                this.movies.push(movie);
                this.selectedMovie = null;
            });
    }
    delete(movie: Movie): void {
        this.movieService
            .delete(movie.id)
            .then(() => {
                this.movies = this.movies.filter(h => h !== movie);
                if (this.selectedMovie === movie) { this.selectedMovie = null; }
            });
    }
}
