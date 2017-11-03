import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { MovieService } from './movie.service';
import 'rxjs/add/operator/switchMap';
import { Movie } from './movie';

@Component({
    selector: 'movie-detail',
    styleUrls: ['./movie-detail.component.css'],
    templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
    movie: Movie;
    constructor(
        private movieService: MovieService,
        private route: ActivatedRoute,
        private location: Location
    ) { }
    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.movieService.getMovie(+params.get('id')))
            .subscribe(movie => this.movie = movie);
    }
    goBack(): void {
        this.location.back();
    }
    save(): void {
        this.movieService.update(this.movie)
            .then(() => this.goBack());
    }
}