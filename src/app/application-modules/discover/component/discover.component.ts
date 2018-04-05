import { Discover } from './../../../model/discover';
import { TranslateService } from '@ngx-translate/core';
import { MovieService } from './../../../service/movie.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  @ViewChild('sortDir') sortDir: any;
  discover: Discover;
  sortChoices: string[];
  sortChosen: string;

  constructor(private movieService: MovieService, private translate: TranslateService) { }

  ngOnInit() {
    this.sortDir.value = 'desc';
    this.sortChoices = ['popularity', 'release_date', 'revenue', 'original_title', 'vote_average', 'vote_count'];
    this.sortChosen = this.sortChoices[0];
  }

  search() {
    console.log('this.sortChosen', this.sortChosen);
    console.log('this.sortDir.value', this.sortDir.value);
    this.movieService.getMoviesDiscover(this.translate.currentLang, this.sortChosen, this.sortDir.value, 1).then(result => this.discover = result);
  }
}
