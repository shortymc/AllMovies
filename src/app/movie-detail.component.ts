import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { MovieService } from './movie.service';
import { DropboxService } from './dropbox.service';
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
    metacritic: string;
    senscritique: string;
    imdb: string;
    wikiEN: string;
    wikiFR: string;

    constructor(
        private movieService: MovieService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router, 
        private dropboxService: DropboxService
    ) { }
    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.movieService.getMovie(+params.get('id'), true, true, true, true))
            .subscribe(movie => {
                this.movie = movie;
                let title = this.movie.title;
                let original = this.movie.original_title;
                let searchTitle = original === '' ? title : original;
                this.movieService.getLinkScore(searchTitle, "metacritic").then(result => this.metacritic = result);
                this.movieService.getLinkScore(searchTitle, "scq").then(result => this.senscritique = result);
                this.movieService.getLinkScore(searchTitle, "imdb").then(result => this.imdb = result);
                this.movieService.getLinkScore(searchTitle, "wen").then(result => this.wikiEN = result);
                this.movieService.getLinkScore(searchTitle, "wikifr").then(result => this.wikiFR = result);
            });
    }
    goBack(): void {
        let back = this.location.back();
        if (back === undefined) {
            this.router.navigate(['/']);
        }
    }
    save(): void {
        this.movieService.update(this.movie)
            .then(() => this.goBack());
    }
    add(movie: Movie): void {
        this.dropboxService.addMovie(movie, "ex.json");
    }
}