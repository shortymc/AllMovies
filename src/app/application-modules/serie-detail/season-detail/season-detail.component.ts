import { ParamMap, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Season } from './../../../model/season';
import { SerieService } from './../../../shared/service/serie.service';

@Component({
  selector: 'app-season-detail',
  templateUrl: './season-detail.component.html',
  styleUrls: ['./season-detail.component.scss']
})
export class SeasonDetailComponent implements OnInit, OnDestroy {
  season: Season;
  subs = [];

  constructor(
    private serieService: SerieService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getSeason(+params.get('id'), +params.get('season'), this.translate.currentLang);
    });
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getSeason(this.season.id, this.season.id, event.lang);
    }));
  }

  getSeason(id: number, season: number, language: string): void {
    this.serieService.getSeason(id, season, language, true)
      .then(res => {
        this.season = res;
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
