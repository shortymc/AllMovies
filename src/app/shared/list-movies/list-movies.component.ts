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

  constructor(private dropboxService: DropboxService) { }

  ngOnInit() {
  }

  addList(): void {
    this.dropboxService.addMovieList(this.movies.filter((reco: Movie) => reco.checked), 'ex.json');
  }

}
