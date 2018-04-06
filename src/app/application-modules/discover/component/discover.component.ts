import { ConvertToHHmmPipe } from './../../../shared/custom.pipe';
import { PageEvent } from '@angular/material/paginator';
import { Discover } from './../../../model/discover';
import { TranslateService } from '@ngx-translate/core';
import { MovieService } from './../../../service/movie.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NouiFormatter } from 'ng2-nouislider';

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
  page: PageEvent;
  nbChecked = 0;
  max = 300;
  runtimeRange: any[] = [0, this.max];
  formatter: NouiFormatter;
  minYear = 1890;
  maxYear = new Date().getFullYear();
  yearRange: any[] = [this.minYear, this.maxYear];

  constructor(
    private movieService: MovieService,
    private translate: TranslateService,
    private router: Router,
    public timePipe: ConvertToHHmmPipe) { }

  ngOnInit() {
    this.sortDir.value = 'desc';
    this.sortChoices = ['popularity', 'release_date', 'revenue', 'original_title', 'vote_average', 'vote_count'];
    this.sortChosen = this.sortChoices[0];
    this.formatter = {
      to(minutes: number): string {
        if (minutes) {
          minutes = Math.round(minutes);
          let result = '';
          result += Math.floor(minutes / 60);
          result += ' h ';
          result += minutes % 60;
          result += ' min ';
          return result;
        } else {
          return '0 min';
        }
      },
      from(time: string): any {
        return time;
      }
    };
  }

  search(initPagination: boolean) {
    console.log('this.sortChosen', this.sortChosen);
    console.log('this.sortDir.value', this.sortDir.value);
    if (initPagination || !this.page) {
      this.page = new PageEvent();
      this.nbChecked = 0;
    }
    let runtimeMin;
    if (this.runtimeRange[0] !== 0) {
      runtimeMin = this.convertTimeToMinutes(this.runtimeRange[0]);
    }
    let runtimeMax;
    if (this.runtimeRange[1] !== this.max) {
      runtimeMax = this.convertTimeToMinutes(this.runtimeRange[1]);
    }
    if (runtimeMax === this.max) {
      runtimeMax = undefined;
    }
    let yearMin;
    if (this.yearRange[0] && this.yearRange[0] !== this.minYear) {
      yearMin = this.yearRange[0];
    }
    let yearMax;
    if (this.yearRange[1] && this.yearRange[1] !== this.maxYear) {
      yearMax = this.yearRange[1];
    }
    // (language, sortField, sortDir, page, yearMin, yearMax, adult, voteAvergeMin, voteAvergeMax,
    //   voteCountMin, certification, runtimeMin, runtimeMax, releaseType, personsIds, genresId, genresWithout, keywordsIds, keywordsWithout))
    this.movieService.getMoviesDiscover(this.translate.currentLang, this.sortChosen, this.sortDir.value, this.page.pageIndex + 1,
      yearMin, yearMax, undefined, undefined, undefined, undefined, undefined, runtimeMin, runtimeMax)
      .then(result => this.discover = result);
  }

  convertTimeToMinutes(time: string): number {
    const h = parseInt(time.substr(0, time.indexOf('h')).trim(), 10);
    const m = parseInt(time.substring(time.lastIndexOf('h') + 1, time.lastIndexOf('min')).trim(), 10);
    return h * 60 + m;

  }

  gotoDetail(id: number, event): void {
    const key = event.which;
    if (key === 1 && event.type !== 'mousedown') {
      this.router.navigate(['movie', id]);
    } else if (key === 2) {
      window.open('/movie/' + id);
    }
  }

  updateSize() {
    this.nbChecked = this.discover.movies.filter(movie => movie.checked).length;
  }

}
