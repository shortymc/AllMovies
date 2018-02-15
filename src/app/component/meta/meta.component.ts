import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MovieService } from './../../service/movie.service';
import { Component, OnInit, Input } from '@angular/core';
import { Url } from '../../constant/url';
import { Movie } from '../../model/movie';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {
  _movie = new BehaviorSubject<Movie>(null);
  @Input()
  set movie(value) {
    this._movie.next(value);
  };

  get movie() {
    return this._movie.getValue();
  }
  metacritic: string;
  senscritique: string;
  imdb: string;
  wikiEN: string;
  wikiFR: string;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this._movie
      .subscribe(x => {
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

  openAll(): void {
    window.open(this.metacritic);
    window.open(this.senscritique);
    window.open(this.wikiEN);
    window.open(this.wikiFR);
  }

}
