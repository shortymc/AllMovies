import { Observable } from 'rxjs/Observable';
import { AuthService } from './../../../service/auth.service';
import { DiscoverCriteria } from './../../../model/discover-criteria';
import { ConvertToHHmmPipe } from './../../../shared/custom.pipe';
import { PageEvent } from '@angular/material/paginator';
import { Discover } from './../../../model/discover';
import { TranslateService } from '@ngx-translate/core';
import { MovieService } from './../../../service/movie.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NouiFormatter } from 'ng2-nouislider';
import { DropDownChoice } from '../../../model/model';
import { FormControl } from '@angular/forms';
import { PersonSearchService } from '../../dashboard/service/person-search.service';
import { Person } from '../../../model/person';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  @ViewChild('sortDir') sortDir: any;
  discover: Discover;
  sortChoices: DropDownChoice[];
  sortChosen: DropDownChoice;
  page: PageEvent;
  nbChecked = 0;
  max = 300;
  adult: boolean;
  runtimeRange: any[] = [0, this.max];
  formatter: NouiFormatter;
  minYear = 1890;
  maxYear = new Date().getFullYear();
  yearRange: any[] = [this.minYear, this.maxYear];
  minVote = 0;
  maxVote = 10;
  voteRange: any[] = [this.minVote, this.maxVote];
  pseudo: string;
  voteCountMin = 10;
  people: Person[] = [];
  peopleCtrl: FormControl;
  filteredPeople: Observable<Person[]>;

  constructor(
    private movieService: MovieService,
    private translate: TranslateService,
    private router: Router,
    private personSearchService: PersonSearchService,
    public timePipe: ConvertToHHmmPipe) { }

  ngOnInit() {
    this.pseudo = AuthService.decodeToken().name;
    this.adult = this.pseudo === 'Test';
    this.sortDir.value = 'desc';
    this.sortChoices = [new DropDownChoice('discover.sort_field.popularity', 'popularity'),
    new DropDownChoice('discover.sort_field.release_date', 'release_date'), new DropDownChoice('discover.sort_field.revenue', 'revenue'),
    new DropDownChoice('discover.sort_field.original_title', 'original_title'), new DropDownChoice('discover.sort_field.vote_average', 'vote_average')
      , new DropDownChoice('discover.sort_field.vote_count', 'vote_count')];
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
    this.peopleCtrl = new FormControl();
    this.filteredPeople = this.peopleCtrl.valueChanges
      .debounceTime(300).distinctUntilChanged().switchMap(term => term
        ? this.personSearchService.search(term, this.adult)
        : Observable.of<Person[]>([]))
      .catch(error => {
        console.error(error);
        return Observable.of<Person[]>([]);
      });
    this.translate.onLangChange.subscribe(() => this.search(false));
  }

  addPeople(person: Person) {
    this.people.push(person);
  }

  buildCriteria(): DiscoverCriteria {
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
    let voteMin;
    if (this.voteRange[0] && this.voteRange[0] !== this.minVote) {
      voteMin = this.voteRange[0];
    }
    let voteMax;
    if (this.voteRange[1] && this.voteRange[1] !== this.maxVote) {
      voteMax = this.voteRange[1];
    }
    let person;
    if (this.people.length > 0) {
      person = this.people.map(p => p.id);
    }
    // (language, sortField, sortDir, page, yearMin, yearMax, adult, voteAvergeMin, voteAvergeMax,
    //   voteCountMin, certification, runtimeMin, runtimeMax, releaseType, personsIds, genresId, genresWithout, keywordsIds, keywordsWithout))
    return new DiscoverCriteria(this.translate.currentLang, this.sortChosen.value, this.sortDir.value, this.page.pageIndex + 1,
      yearMin, yearMax, this.adult, voteMin, voteMax, this.voteCountMin, undefined, runtimeMin, runtimeMax, undefined, person);
  }

  search(initPagination: boolean) {
    console.log('this.sortChosen', this.sortChosen);
    console.log('this.sortDir.value', this.sortDir.value);
    if (initPagination || !this.page) {
      this.page = new PageEvent();
      this.nbChecked = 0;
    }
    this.movieService.getMoviesDiscover(this.buildCriteria()).then(result => this.discover = result);
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

  initSelection() {
    this.discover.movies.forEach((movie) => movie.checked = false);
  }

}
