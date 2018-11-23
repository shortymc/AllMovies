import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NouiFormatter } from 'ng2-nouislider';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

import { DiscoverCriteria } from './../../../model/discover-criteria';
import { Discover } from './../../../model/discover';
import {
  KeywordSearchService, CertificationService, GenreService, PersonSearchService, TitleService, AuthService, MovieService
} from './../../../shared/shared.module';
import { DropDownChoice, Keyword } from '../../../model/model';
import { Person } from '../../../model/person';
import { Utils } from '../../../shared/utils';
import { ReleaseType } from '../../../constant/release-type';

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
  voteCountMin = 10;
  voteCountRange = [0, 10, 50, 100, 500, 1000, 5000, 10000];
  people: Person[] = [];
  keyword: Keyword[] = [];
  isWithoutKeyword = false;
  allGenres: DropDownChoice[];
  selectedGenres: DropDownChoice[];
  isWithoutGenre = false;
  allCertif: DropDownChoice[];
  selectedCertif: DropDownChoice;
  allReleaseType: DropDownChoice[];
  selectedReleaseType: DropDownChoice[];
  faBookmark = faBookmark;
  clean = false;

  constructor(
    private movieService: MovieService,
    private translate: TranslateService,
    private router: Router,
    public personService: PersonSearchService,
    public keywordService: KeywordSearchService,
    private genreService: GenreService,
    private certifService: CertificationService,
    private title: TitleService,
    private elemRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.discover');
    this.adult = AuthService.decodeToken().name === 'Test';
    this.sortDir.value = 'desc';
    this.sortChoices = [new DropDownChoice('discover.sort_field.popularity', 'popularity'),
    new DropDownChoice('discover.sort_field.release_date', 'release_date'), new DropDownChoice('discover.sort_field.revenue', 'revenue'),
    new DropDownChoice('discover.sort_field.original_title', 'original_title'), new DropDownChoice('discover.sort_field.vote_average', 'vote_average')
      , new DropDownChoice('discover.sort_field.vote_count', 'vote_count')];
    this.sortChosen = this.sortChoices[0];
    this.allReleaseType = [new DropDownChoice('release_type.premiere', ReleaseType.RELEASE_PREMIERE),
    new DropDownChoice('release_type.theatrical_limited', ReleaseType.RELEASE_THEATRICAL_LIMITED),
    new DropDownChoice('release_type.theatrical', ReleaseType.RELEASE_THEATRICAL),
    new DropDownChoice('release_type.digital', ReleaseType.RELEASE_DIGITAL),
    new DropDownChoice('release_type.physical', ReleaseType.RELEASE_PHYSICAL),
    new DropDownChoice('release_type.tv', ReleaseType.RELEASE_TV)];
    this.formatter = {
      to(minutes: any): any {
        return Utils.convertTimeNumberToString(minutes);
      },
      from(time: any): any {
        const res = Utils.convertTimeStringToNumber(time);
        if (isNaN(res)) {
          return time;
        }
        return res;
      }
    };
    this.translate.onLangChange.subscribe(() => {
      this.getAllGenres(this.selectedGenres ? this.selectedGenres.map(g => g.value) : []);
      this.getAllCertification(this.selectedCertif ? this.selectedCertif.value : '');
      this.search(false);
    });
    // Stored research
    const criteria = <DiscoverCriteria>Utils.parseJson(sessionStorage.getItem('criteria'));
    const people = <Person[]>Utils.parseJson(sessionStorage.getItem('people'));
    const genres = <DropDownChoice[]>Utils.parseJson(sessionStorage.getItem('genre'));
    const keyword = <Keyword[]>Utils.parseJson(sessionStorage.getItem('keyword'));
    const certif = <DropDownChoice>Utils.parseJson(sessionStorage.getItem('certif'));
    if (criteria || people || keyword || genres || certif) {
      this.initFromCriteria(criteria, people, genres, keyword, certif);
      this.search(false);
    }
    this.getAllGenres(this.selectedGenres ? this.selectedGenres.map(g => g.value) : []);
    this.getAllCertification(criteria ? criteria.certification : '');
  }

  getAllGenres(genresId: number[]): void {
    this.genreService.getAllGenre(this.translate.currentLang).subscribe(genres => {
      this.allGenres = genres.map(genre => new DropDownChoice(genre.name, genre.id));
      this.selectedGenres = genresId ? this.allGenres.filter(genre => genresId.includes(genre.value)) : [];
    });
  }

  getAllCertification(certification: string): void {
    this.certifService.getAllCertification().subscribe(certif => {
      this.allCertif = certif.map(c => new DropDownChoice(c.meaning, c.certification));
      this.selectedCertif = certification ? this.allCertif.find(c => c.value === certification) : undefined;
    });
  }

  initFromCriteria(criteria: DiscoverCriteria, people: Person[], genres: DropDownChoice[], keyword: Keyword[], certif: DropDownChoice): void {
    if (criteria) {
      this.sortDir.value = criteria.sortDir;
      this.sortChosen = this.sortChoices.find(sort => sort.value === criteria.sortField);
      this.page = new PageEvent();
      this.page.pageIndex = criteria.page ? criteria.page - 1 : 0;
      this.yearRange = [criteria.yearMin ? criteria.yearMin : this.minYear, criteria.yearMax ? criteria.yearMax : this.maxYear];
      this.voteRange = [criteria.voteAvergeMin ? criteria.voteAvergeMin : this.minVote,
      criteria.voteAvergeMax ? criteria.voteAvergeMax : this.maxVote];
      this.runtimeRange = [criteria.runtimeMin ? criteria.runtimeMin : 0, criteria.runtimeMax ? criteria.runtimeMax : this.max];
      this.voteCountMin = criteria.voteCountMin;
      this.isWithoutGenre = criteria.genresWithout;
      this.isWithoutKeyword = criteria.keywordsWithout;
      if (criteria.releaseType) {
        this.selectedReleaseType = this.allReleaseType.filter(type => criteria.releaseType.includes(type.value));
      }
    }
    this.people = people ? people : [];
    this.keyword = keyword ? keyword : [];
    this.selectedGenres = genres;
    this.selectedCertif = certif;
  }

  clear(): void {
    sessionStorage.removeItem('criteria');
    sessionStorage.removeItem('people');
    sessionStorage.removeItem('keyword');
    sessionStorage.removeItem('genre');
    sessionStorage.removeItem('certif');
    const crit = new DiscoverCriteria();
    crit.language = this.translate.currentLang;
    crit.sortField = this.sortChoices[0].value;
    crit.sortDir = 'desc';
    crit.page = 0;
    crit.voteCountMin = 0;
    crit.genresWithout = false;
    crit.keywordsWithout = false;
    this.initFromCriteria(crit, undefined, undefined, undefined, undefined);
    this.search(true);
    this.clean = true;
  }

  buildCriteria(): DiscoverCriteria {
    const criteria = new DiscoverCriteria();
    this.buildRuntimeCriteria(criteria);
    if (this.yearRange[0] && this.yearRange[0] !== this.minYear) {
      criteria.yearMin = this.yearRange[0];
    }
    if (this.yearRange[1] && this.yearRange[1] !== this.maxYear) {
      criteria.yearMax = this.yearRange[1];
    }
    this.buildVoteCriteria(criteria);
    if (this.people.length > 0) {
      criteria.personsIds = this.people.map(p => p.id);
    }
    if (this.keyword.length > 0) {
      criteria.keywordsIds = this.keyword.map(p => p.id);
    }
    if (this.selectedGenres && this.selectedGenres.length > 0) {
      criteria.genresId = this.selectedGenres.map(g => g.value);
    }
    if (this.selectedCertif) {
      criteria.certification = this.selectedCertif.value;
    }
    if (this.selectedReleaseType && this.selectedReleaseType.length > 0) {
      criteria.releaseType = this.selectedReleaseType.map(type => type.value);
    }
    criteria.language = this.translate.currentLang;
    criteria.sortField = this.sortChosen.value;
    criteria.sortDir = this.sortDir.value;
    criteria.page = this.page.pageIndex + 1;
    criteria.adult = this.adult;
    criteria.voteCountMin = this.voteCountMin;
    criteria.genresWithout = this.isWithoutGenre;
    criteria.keywordsWithout = this.isWithoutKeyword;
    sessionStorage.setItem('criteria', Utils.stringifyJson(criteria));
    sessionStorage.setItem('people', Utils.stringifyJson(this.people));
    sessionStorage.setItem('keyword', Utils.stringifyJson(this.keyword));
    sessionStorage.setItem('genre', Utils.stringifyJson(this.selectedGenres));
    sessionStorage.setItem('certif', Utils.stringifyJson(this.selectedCertif));
    return criteria;
  }

  buildRuntimeCriteria(criteria: DiscoverCriteria): void {
    if (this.runtimeRange[0] !== 0) {
      criteria.runtimeMin = this.runtimeRange[0];
    }
    if (this.runtimeRange[1] !== this.max) {
      criteria.runtimeMax = this.runtimeRange[1];
    }
    if (criteria.runtimeMax === this.max) {
      criteria.runtimeMax = undefined;
    }
  }

  buildVoteCriteria(criteria: DiscoverCriteria): void {
    if (this.voteRange[0] && this.voteRange[0] !== this.minVote) {
      criteria.voteAvergeMin = this.voteRange[0];
    }
    if (this.voteRange[1] && this.voteRange[1] !== this.maxVote) {
      criteria.voteAvergeMax = this.voteRange[1];
    }
  }

  search(initPagination: boolean): void {
    if (initPagination || !this.page) {
      this.page = new PageEvent();
      this.nbChecked = 0;
    }
    this.movieService.getMoviesDiscover(this.buildCriteria()).then(result => {
      this.discover = result;
      this.elemRef.nativeElement.querySelector('#searchBtn').scrollIntoView();
    });
  }

  updateSize(): void {
    this.nbChecked = this.discover.movies.filter(movie => movie.checked).length;
  }

  initSelection(): void {
    this.discover.movies.forEach((movie) => movie.checked = false);
  }

}
