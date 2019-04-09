import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { faChevronCircleLeft, faImage, faChevronCircleRight, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import { TitleService, MenuService } from './../../../shared/shared.module';
import { TabsService } from './../../../shared/service/tabs.service';
import { Tag } from './../../../model/tag';
import { DuckDuckGo } from './../../../constant/duck-duck-go';
import { SerieService } from '../../../shared/shared.module';
import { Serie } from '../../../model/serie';
import { Keyword, Genre, DetailConfig } from '../../../model/model';

@Component({
  selector: 'app-serie-detail',
  styleUrls: ['./serie-detail.component.scss'],
  templateUrl: './serie-detail.component.html',
})
export class SerieDetailComponent implements OnInit, OnDestroy {
  id: number;
  config: DetailConfig;
  serie: Serie;
  tags: Tag[];
  showTags = false;
  isImagesVisible = false;
  showTitles = false;
  Url = DuckDuckGo;
  subs = [];

  faChevronCircleLeft = faChevronCircleLeft;
  faChevronCircleRight = faChevronCircleRight;
  faImage = faImage;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private serieService: SerieService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    private title: TitleService,
    private router: Router,
    public tabsService: TabsService,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    this.config = new DetailConfig(true, true, true, true, true, true, true, true, this.translate.currentLang);
    this.subs.push(this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        const idParam = +params.get('id');
        if (idParam && idParam !== 0) {
          this.id = idParam;
          this.getSerie(this.id);
        }
      }
    }));
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.config.lang = event.lang;
      this.getSerie(this.id);
    }));
  }

  getSerie(id: number): void {
    if (this.id && this.id !== 0) {
      this.serieService.getSerie(id, this.config, true).then((serie) => {
        this.serie = serie;
        this.title.setTitle(serie.title);
        this.menuService.scrollTo$.next(0);
      });
    }
  }

  redirectGenreToDiscover(genre: Genre): void {
    this.router.navigate(['discover'], { queryParams: { genre: JSON.stringify([genre.id]) } });
  }

  redirectKeywordToDiscover(keyword: Keyword): void {
    this.router.navigate(['discover'], { queryParams: { keyword: JSON.stringify([keyword.id]) } });
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
