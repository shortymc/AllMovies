import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NouiFormatter } from 'ng2-nouislider';

import { DiscoverCriteria } from './../../../model/discover-criteria';
import { Discover } from './../../../model/discover';
import {
  KeywordSearchService, CertificationService, GenreService, PersonSearchService, TitleService, AuthService, MovieService
} from './../../../shared/shared.module';
import { DropDownChoice } from '../../../model/model';
import { Utils } from '../../../shared/utils';
import { ReleaseType } from '../../../constant/release-type';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit, OnDestroy {
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
  people: number[] = [];
  keyword: number[] = [];
  isWithoutKeyword = false;
  allGenres: DropDownChoice[];
  selectedGenres: number[] = [];
  isWithoutGenre = false;
  allCertif: DropDownChoice[];
  selectedCertif: DropDownChoice;
  allReleaseType: DropDownChoice[];
  selectedReleaseType: DropDownChoice[];
  playing = false;
  playingDate: string[];
  clean = false;
  subs = [];

  constructor(
    private movieService: MovieService,
    private translate: TranslateService,
    public personService: PersonSearchService,
    public keywordService: KeywordSearchService,
    private genreService: GenreService,
    private certifService: CertificationService,
    private route: ActivatedRoute,
    private title: TitleService,
    private router: Router,
    private elemRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.discover');
    const user = AuthService.decodeToken(undefined);
    if (user) {
      this.adult = user.name === 'Test';
    }

    this.sortDir.value = 'desc';
    this.sortChoices = [new DropDownChoice('discover.sort_field.popularity', 'popularity'),
    new DropDownChoice('discover.sort_field.release_date', 'release_date'), new DropDownChoice('discover.sort_field.revenue', 'revenue'),
    new DropDownChoice('discover.sort_field.original_title', 'original_title'), new DropDownChoice('discover.sort_field.vote_average', 'vote_average')
      , new DropDownChoice('discover.sort_field.vote_count', 'vote_count')];
    this.sortChosen = this.sortChoices[0];
    this.allReleaseType = [new DropDownChoice('release_type.' + ReleaseType.RELEASE_PREMIERE, ReleaseType.RELEASE_PREMIERE),
    new DropDownChoice('release_type.' + ReleaseType.RELEASE_THEATRICAL_LIMITED, ReleaseType.RELEASE_THEATRICAL_LIMITED),
    new DropDownChoice('release_type.' + ReleaseType.RELEASE_THEATRICAL, ReleaseType.RELEASE_THEATRICAL),
    new DropDownChoice('release_type.' + ReleaseType.RELEASE_DIGITAL, ReleaseType.RELEASE_DIGITAL),
    new DropDownChoice('release_type.' + ReleaseType.RELEASE_PHYSICAL, ReleaseType.RELEASE_PHYSICAL),
    new DropDownChoice('release_type.' + ReleaseType.RELEASE_TV, ReleaseType.RELEASE_TV)];
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
    this.initPlayingDate();

    this.subs.push(this.translate.onLangChange.subscribe(() => {
      this.getAllGenres(this.selectedGenres ? this.selectedGenres : []);
      this.getAllCertification(this.selectedCertif ? this.selectedCertif.value : '');
      this.search(false);
    }));

    // Stored research
    this.subs.push(this.route.queryParams.subscribe(
      params => {
        this.people = Utils.parseJson(params.people);
        this.selectedGenres = Utils.parseJson(params.genre);
        this.keyword = Utils.parseJson(params.keyword);
      }
    ));
    const criteria = <DiscoverCriteria>Utils.parseJson(sessionStorage.getItem('criteria'));
    const certif = <DropDownChoice>Utils.parseJson(sessionStorage.getItem('certif'));
    if (criteria || this.people || this.keyword || this.selectedGenres || certif) {
      this.initFromCriteria(criteria, certif);
      this.search(false);
    }
    this.getAllGenres(this.selectedGenres ? this.selectedGenres : []);
    this.getAllCertification(criteria ? criteria.certification : '');
  }

  getAllGenres(genresId: number[]): void {
    this.subs.push(this.genreService.getAllGenre(this.translate.currentLang).subscribe(genres => {
      this.allGenres = genres.map(genre => new DropDownChoice(genre.name, genre.id));
      this.selectedGenres = genresId ? this.allGenres.filter(genre => genresId.includes(genre.value)).map(genre => genre.value) : [];
    }));
  }

  getAllCertification(certification: string): void {
    this.subs.push(this.certifService.getAllCertification().subscribe(certif => {
      this.allCertif = certif.map(c => new DropDownChoice(c.meaning, c.certification));
      this.selectedCertif = certification ? this.allCertif.find(c => c.value === certification) : undefined;
    }));
  }

  initFromCriteria(criteria: DiscoverCriteria, certif: DropDownChoice): void {
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
      this.playing = criteria.playing;
      if (criteria.playingDate && criteria.playingDate.length !== 0) {
        this.playingDate = criteria.playingDate;
      }
      if (criteria.releaseType) {
        this.selectedReleaseType = this.allReleaseType.filter(type => criteria.releaseType.includes(type.value));
      }
    }
    this.selectedCertif = certif;
  }

  clear(): void {
    sessionStorage.removeItem('criteria');
    sessionStorage.removeItem('certif');
    const crit = new DiscoverCriteria();
    crit.language = this.translate.currentLang;
    crit.sortField = this.sortChoices[0].value;
    crit.sortDir = 'desc';
    crit.page = 0;
    crit.voteCountMin = 10;
    crit.genresWithout = false;
    crit.keywordsWithout = false;
    this.people = [];
    this.keyword = [];
    this.selectedGenres = [];
    this.playing = false;
    this.initFromCriteria(crit, undefined);
    this.search(true);
    this.clean = true;
  }

  buildCriteria(): DiscoverCriteria {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        people: JSON.stringify(this.people), keyword: JSON.stringify(this.keyword), genre: JSON.stringify(this.selectedGenres)
      }
    });
    const criteria = new DiscoverCriteria();
    this.buildRuntimeCriteria(criteria);
    if (this.yearRange[0] && this.yearRange[0] !== this.minYear) {
      criteria.yearMin = this.yearRange[0];
    }
    if (this.yearRange[1] && this.yearRange[1] !== this.maxYear) {
      criteria.yearMax = this.yearRange[1];
    }
    this.buildVoteCriteria(criteria);
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
    criteria.playing = this.playing;
    criteria.playingDate = this.playingDate;
    sessionStorage.setItem('criteria', Utils.stringifyJson(criteria));
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

  initPlayingDate(): void {
    const crit = new DiscoverCriteria();
    crit.region = 'FR';
    crit.language = this.translate.currentLang;
    this.movieService.getMoviesPlaying(crit).then(dates => {
      this.playingDate = dates;
    });
  }

  search(initPagination: boolean): void {
    if (initPagination || !this.page) {
      this.page = new PageEvent();
      this.nbChecked = 0;
    }
    const criteria = this.buildCriteria();
    if (this.playing) {
      criteria.yearMin = this.playingDate[0];
      criteria.yearMax = this.playingDate[1];
    }
    this.movieService.getMoviesDiscover(criteria, this.people, this.selectedGenres, this.keyword).then(result => {
      this.discover = result;
      this.elemRef.nativeElement.querySelector('#searchBtn').scrollIntoView();
    });
  }

  updateSize(): void {
    this.nbChecked = this.discover.movies.filter(movie => movie.checked).length;
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
