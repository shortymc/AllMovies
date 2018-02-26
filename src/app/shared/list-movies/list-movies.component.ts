import { Component, OnInit, Input } from '@angular/core';
import { DropboxService } from '../../service/dropbox.service';
import { Movie } from '../../model/movie';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss']
})
export class ListMoviesComponent implements OnInit {
  @Input()
  movies: Movie[];
  @Input()
  label: string;
  page = 1;
  moviesToShow: Movie[];
  pageSize = 5;

  constructor(private dropboxService: DropboxService) { }

  ngOnInit() {
    this.getMoviesToShow(this.movies, this.page);
  }

  addList(): void {
    this.dropboxService.addMovieList(this.movies.filter((reco: Movie) => reco.checked), 'ex.json');
  }

  getMoviesToShow(movies, page) {
    this.moviesToShow = movies.slice((page - 1) * this.pageSize, page * this.pageSize);
  }

  pageChanged(event: any) {
    this.getMoviesToShow(this.movies, event);
  }

}
