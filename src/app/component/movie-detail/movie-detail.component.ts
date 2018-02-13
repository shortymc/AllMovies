import { Url } from './../../constant/url';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { MovieService } from '../../service/movie.service';
import { DropboxService } from '../../service/dropbox.service';
import { Movie } from '../../model/movie';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  movie: Movie;
  isImagesCollapsed = false;
  metacritic: string;
  senscritique: string;
  imdb: string;
  wikiEN: string;
  wikiFR: string;
  Url = Url;

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
        const title = this.movie.title;
        const original = this.movie.original_title;
        const searchTitle = original === '' ? title : original;
        this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_METACRITIC).then(result => this.metacritic = result);
        this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_SENSCRITIQUE).then(result => this.senscritique = result);
        this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_IMDB).then(result => this.imdb = result);
        this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_WIKI_EN).then(result => this.wikiEN = result);
        this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_WIKI_FR).then(result => this.wikiFR = result);
      });
  }
  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }
  openAll(): void {
    window.open(this.metacritic);
    window.open(this.senscritique);
    window.open(this.wikiEN);
    window.open(this.wikiFR);
  }
  save(): void {
    this.movieService.update(this.movie)
      .then(() => this.goBack());
  }
  add(movie: Movie): void {
    this.dropboxService.addMovie(movie, 'ex.json');
  }
  addList(): void {
    this.dropboxService.addMovieList(this.movie.recommendations.filter((reco: Movie) => reco.checked), 'ex.json');
  }
}
