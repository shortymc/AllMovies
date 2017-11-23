import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { MovieService } from './movie.service';
import { Movie } from './movie';

@Component({
    selector: 'movie-detail',
    styleUrls: ['./movie-detail.component.css'],
    templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
    movie: Movie;
    private original = "https://image.tmdb.org/t/p/original";
    private thumb = "https://image.tmdb.org/t/p/w154";
    private preview = "https://image.tmdb.org/t/p/w92";
    isImagesCollapsed = false;

    constructor(
        private movieService: MovieService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router
    ) { }
    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.movieService.getMovie(+params.get('id'), true, true, true, true))
            .subscribe(movie => this.movie = movie);
    }
    goBack(): void {
        if(this.location._baseHref !== "") {
            this.location.back();
        } else {
            this.router.navigate(['/']);    
        }
    }
    save(): void {
        this.movieService.update(this.movie)
            .then(() => this.goBack());
    }
}