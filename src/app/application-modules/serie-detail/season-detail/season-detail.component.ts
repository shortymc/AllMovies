import { faChevronCircleLeft, faImage, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Season } from './../../../model/season';
import { SerieService, TitleService } from './../../../shared/shared.module';

@Component({
  selector: 'app-season-detail',
  templateUrl: './season-detail.component.html',
  styleUrls: ['./season-detail.component.scss']
})
export class SeasonDetailComponent implements OnInit, OnDestroy {
  serieId: number;
  season: Season;
  maxSeason: number;
  serie: string;
  isImagesVisible = false;

  faChevronCircleLeft = faChevronCircleLeft;
  faImage = faImage;
  faArrowCircleLeft = faArrowCircleLeft;
  faArrowCircleRight = faArrowCircleRight;
  subs = [];

  constructor(
    private serieService: SerieService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.maxSeason = +sessionStorage.getItem('season_max');
    this.serie = sessionStorage.getItem('serie');
    this.title.setTitle(this.serie);
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.serieId = +params.get('id');
      this.getSeason(this.serieId, +params.get('season'), this.translate.currentLang);
    });
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getSeason(this.serieId, this.season.seasonNumber, event.lang);
    }));
  }

  getSeason(id: number, season: number, language: string): void {
    this.serieService.getSeason(id, season, language, true)
      .then(res => {
        this.season = res;
      });
  }

  goBack(): void {
    this.router.navigate(['serie/' + this.serieId]);
  }

  goPrev(): void {
    this.router.navigate(['serie/' + this.serieId + '/' + (this.season.seasonNumber - 1)]);
  }

  goNext(): void {
    this.router.navigate(['serie/' + this.serieId + '/' + (this.season.seasonNumber + 1)]);
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('serie');
    sessionStorage.removeItem('season_max');
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
