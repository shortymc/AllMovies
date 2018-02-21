import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Url } from './../../../constant/url';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../../../service/movie.service';
import { DropboxService } from '../../../service/dropbox.service';
import { Movie } from '../../../model/movie';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  movie: Movie;
  isImagesCollapsed = false;
  Url = Url;

  constructor(private movieService: MovieService, private route: ActivatedRoute,
    private location: Location, private router: Router, private dropboxService: DropboxService) { }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.movieService.getMovie(+params.get('id'), true, true, true, true))
      .subscribe(movie => {
        this.movie = movie;
      });
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }

  add(movie: Movie): void {
    this.dropboxService.addMovie(movie, 'ex.json');
  }
}
