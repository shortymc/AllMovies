/* tslint:disable:no-string-literal */
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { forkJoin, BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Sort } from '@angular/material/sort';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {
  faTrash, faHashtag, faImage, faFilm, faFlag, faCalendar, faStar, faGlobeAmericas, faList, faChevronCircleRight, faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import * as moment from 'moment-mini-ts';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NouiFormatter } from 'ng2-nouislider';

import { Constants } from '../../../../constant/constants';
import { Utils } from '../../../../shared/utils';
import { SerieService, TitleService, MovieService, MyDatasService, MyTagsService, ToastService } from '../../../../shared/shared.module';
import { Serie } from './../../../../model/serie';
import { Movie } from './../../../../model/movie';
import { Tag, TagData } from '../../../../model/tag';
import { Data } from '../../../../model/data';
import { Genre, DetailConfig, Level, ImageSize } from '../../../../model/model';
import { DatasConstants } from './datas.constants';
import { ImagePipe } from '../../../../shared/pipes/image.pipe';

library.add(faClock);
library.add(faTimesCircle);

@Component({
  selector: 'app-my-datas',
  templateUrl: './datas.component.html',
  styleUrls: ['./datas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DatasComponent<T extends Data> implements OnInit, OnDestroy {
  imageSize = ImageSize;
  init_columns: string[];
  medium_columns: string[];
  mobile_columns: string[];
  displayedColumns: string[];
  isMovie: boolean;
  allDatas: T[];
  tags: Tag[];
  filteredTags: number[];
  length: number;
  maxRuntime = 1;
  runtimeRange: any[] = [0, 1];
  formatter: NouiFormatter;
  displayedData: T[] = [];
  filter: string;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions = [10, 25, 50, 100];
  sort: Sort;
  nbChecked = 0;
  checkHeader = false;
  isIndeterminate = false;
  genres: Genre[];
  filteredGenres: number[];
  expandedElement: T;
  expandedColumn = 'tags';
  displayedTags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);
  selectedTag: Tag;
  scrollTo: HTMLElement;
  subs = [];

  faTrash = faTrash;
  faHashtag = faHashtag;
  faImage = faImage;
  faFilm = faFilm;
  faFlag = faFlag;
  faCalendar = faCalendar;
  faStar = faStar;
  faGlobe = faGlobeAmericas;
  faList = faList;
  faAngleDown = faAngleDown;
  faChevronCircleRight = faChevronCircleRight;

  constructor(
    private movieService: MovieService,
    private serieService: SerieService,
    private breakpointObserver: BreakpointObserver,
    private myDatasService: MyDatasService<T>,
    private myTagsService: MyTagsService,
    public translate: TranslateService,
    private imagePipe: ImagePipe,
    private toast: ToastService,
    private router: Router,
    private elemRef: ElementRef,
    private title: TitleService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formatter = Utils.timeSliderFormatter;
    this.subs.push(this.activeRoute.data.subscribe(data => {
      this.isMovie = data.isMovie;
      this.initColumns();
      this.observeScreenSize();
      const times = data.dataList.map(d => this.isMovie ? d['time'] : d['runtimes'][0]).filter(d => d !== undefined && d !== null);
      this.maxRuntime = times.reduce((a, b) => a > b ? a : b);
      this.runtimeRange = [0, this.maxRuntime];
      this.title.setTitle('title.' + (this.isMovie ? 'movies' : 'series'));
      this.sort = { active: this.isMovie ? 'added' : 'firstAired', direction: 'desc' };
      this.getDatas(this.translate.currentLang, data.dataList);
      this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.getDatas(event.lang, data.dataList);
      }));
      this.subs.push(this.activeRoute.queryParams.subscribe(
        params => {
          this.sort = params.sort ? Utils.parseJson(params.sort) : { active: this.isMovie ? 'added' : 'firstAired', direction: 'desc' };
          this.filteredTags = Utils.parseJson(params.tags);
          this.pageIndex = params.pageIndex ? params.pageIndex : 0;
          this.pageSize = params.pageSize ? params.pageSize : 25;
          this.filter = params.search;
          this.filteredGenres = Utils.parseJson(params.genres);
          this.runtimeRange = params.runtime ? Utils.parseJson(params.runtime) : [0, this.maxRuntime];
          this.paginate(this.refreshData());
        }));
    }));
    this.getTags();
  }

  private observeScreenSize(): void {
    this.breakpointObserver.observe([
      Constants.MEDIA_MAX_700,
      Constants.MEDIA_MAX_1000
    ]).subscribe(result => {
      if (result.breakpoints[Constants.MEDIA_MAX_1000] && result.breakpoints[Constants.MEDIA_MAX_700]) {
        this.displayedColumns = this.mobile_columns;
      } else if (result.breakpoints[Constants.MEDIA_MAX_1000] && !result.breakpoints[Constants.MEDIA_MAX_700]) {
        this.displayedColumns = this.medium_columns;
      } else {
        this.displayedColumns = this.init_columns;
      }
    });
  }

  initColumns(): void {
    this.init_columns = this.isMovie ? DatasConstants.INIT_COLUMNS_MOVIES : DatasConstants.INIT_COLUMNS_SERIES;
    this.medium_columns = this.isMovie ? DatasConstants.MEDIUM_COLUMNS_MOVIES : DatasConstants.MEDIUM_COLUMNS_SERIES;
    this.mobile_columns = this.isMovie ? DatasConstants.MOBILE_COLUMNS_MOVIES : DatasConstants.MOBILE_COLUMNS_SERIES;
    this.displayedColumns = this.init_columns;
  }

  getDatas(lang: string, datas: T[]): void {
    this.allDatas = datas;
    this.length = this.allDatas.length;
    this.getAllGenres(lang);
  }

  getTags(): void {
    this.subs.push(this.myTagsService.myTags$.subscribe((tags) => this.tags = tags));
  }

  getAllGenres(lang: string): void {
    const all: Genre[] = [];
    this.allDatas.filter(d => d.translation.get(lang).category).forEach((data: T) => {
      all.push(...data.translation.get(lang).category);
    });
    this.genres = [];
    all.forEach((genre: Genre) => {
      if (!this.genres.map(g => g.id).includes(genre.id)) {
        this.genres.push(genre);
      }
    });
    this.genres.sort((a, b) => Utils.compare(a.name.toLowerCase(), b.name.toLowerCase(), true));
  }

  refreshData(): T[] {
    let list = this.filterGenres();
    list = this.filterTags(list);
    list = list.filter(data => {
      const time = this.isMovie ? data['time'] : data['runtimes'][0];
      return (time >= this.runtimeRange[0] && time <= this.runtimeRange[1]) || (this.runtimeRange[0] === 0 && !time);
    });
    const byFields = Utils.filterByFields(list,
      this.displayedColumns.filter(col => !['added', 'select', 'details', 'genres', 'meta', 'thumbnail', 'tag-icon', 'name'].includes(col)),
      this.filter);
    let byTitle = [];
    if (this.filter) {
      byTitle = list.filter(m => m.translation.get(this.translate.currentLang).name.toLowerCase().includes(this.filter.toLowerCase()));
    }
    list = Utils.sortData(Utils.unique(byFields.concat(byTitle)), this.sort, this.translate.currentLang);
    this.length = list.length;
    this.displayedData.forEach(d => d.checked = false);
    this.checkHeader = false;
    this.isIndeterminate = false;
    this.updateSizeChecked();
    return list;
  }

  paginate(data: T[]): void {
    this.displayedData = data.slice(this.pageIndex * this.pageSize, (+this.pageIndex + 1) * this.pageSize);
    this.checkAndFixData(this.displayedData, this.translate.currentLang);
  }

  filterGenres(): T[] {
    let list = [];
    if (this.filteredGenres && this.filteredGenres.length > 0) {
      list = this.allDatas.filter((data: T) =>
        this.filteredGenres.every((genreId: number) =>
          data.translation.get(this.translate.currentLang).category.map(genre => genre.id).includes(genreId)));
    } else {
      list = this.allDatas;
    }
    return list;
  }

  filterTags(list: T[]): T[] {
    if (this.filteredTags && this.filteredTags.length > 0) {
      const filter = this.tags.filter(tag => this.filteredTags.includes(tag.id));
      return list.filter((m: T) => filter.every(t => t.datas.filter(d => d.movie === this.isMovie).map(data => data.id).includes(m.id)));
    } else {
      return list;
    }
  }

  onFilterOrPaginate(genres: number[], tags: number[], pageIndex: number, pageSize: number, runtimeRange: any[]): void {
    this.router.navigate(['.'], {
      relativeTo: this.activeRoute,
      queryParams: {
        pageIndex: pageIndex, pageSize: pageSize, search: this.filter, runtime: JSON.stringify(runtimeRange),
        genres: JSON.stringify(genres), tags: JSON.stringify(tags), sort: JSON.stringify(this.sort)
      }
    });
  }

  updateCheck(): void {
    this.updateSizeChecked();
    if (this.displayedData.every(data => data.checked)) {
      this.checkHeader = true;
      this.isIndeterminate = false;
    } else if (this.displayedData.every(data => !data.checked)) {
      this.checkHeader = false;
      this.isIndeterminate = false;
    } else if (this.displayedData.some(data => data.checked)) {
      this.checkHeader = true;
      this.isIndeterminate = true;
    }
  }

  updateSizeChecked(): void {
    this.nbChecked = this.displayedData.filter(data => data.checked).length;
  }

  headerChecked(check: boolean): void {
    this.checkHeader = this.isIndeterminate ? false : check;
    this.isIndeterminate = false;
    this.displayedData.forEach(d => d.checked = this.checkHeader);
    this.updateSizeChecked();
  }

  /**
   * Requests datas to DataDb if some properties (genres, time, score) are missing or if the last updated is from more than two months ago.
   * @param  {T[]} datas datas to check
   * @param  {string} lang the lang to request the data to
   */
  checkAndFixData(datas: T[], lang: string): void {
    let incomplete: number[] = [];
    const twoMonthsAgo = moment().add(-2, 'months');
    try {
      for (const data of datas) {
        const tr = data.translation.get(lang);
        let isNoTime = false;
        if (data instanceof Movie) {
          isNoTime = (<Movie>data).time === undefined;
        } else if (data instanceof Serie) {
          isNoTime = (<Serie>data).runtimes === undefined;
        }
        if ((isNoTime || tr.category === undefined || data.score === undefined) &&
          (data.updated === undefined || moment(data.updated).isBefore(twoMonthsAgo))) {
          incomplete.push(data.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
    forkJoin(datas.map(d => Utils.imageExists(d.id, this.imagePipe.transform(d.translation.get(lang).poster, ImageSize.small))))
      .subscribe((exists: any[]) => {
        exists.forEach(e => {
          if (e.result === false && !incomplete.includes(e.id)) {
            incomplete.push(e.id);
          }
        });
        incomplete = incomplete.slice(0, 15);
        this.updateDatas(incomplete, lang);
      });
  }

  updateDatas(toUpdate: number[], lang: string): void {
    try {
      forkJoin(this.download(toUpdate, lang)).subscribe(
        (datas: T[]) => {
          datas.forEach(m => {
            m.updated = new Date();
            if (m.score === undefined) {
              m.score = {};
            }
          });
          this.myDatasService.update(datas, this.isMovie).then((updated) => {
            updated.forEach(up => {
              const index = this.allDatas.map(a => a.id).indexOf(up.id);
              up.added = this.allDatas[index].added;
              this.allDatas[index] = up;
            });
            this.paginate(this.refreshData());
          });
        },
        err => console.error(err)
      );
    } catch (err) {
      console.error(err);
    }
  }

  download(toDownload: number[], lang: string): Observable<T>[] {
    const obs = [];
    const otherLang = lang === 'fr' ? 'en' : 'fr';
    const conf1 = new DetailConfig(false, false, false, false, false, false, false, false, !this.isMovie, lang);
    const conf2 = new DetailConfig(false, false, false, false, false, false, false, false, !this.isMovie, otherLang);
    toDownload.forEach((id: number) => {
      if (this.isMovie) {
        obs.push(this.movieService.getMovie(id, conf1, false));
        obs.push(this.movieService.getMovie(id, conf2, false));
      } else {
        obs.push(this.serieService.getSerie(id, conf1, false));
        obs.push(this.serieService.getSerie(id, conf2, false));
      }
    });
    return obs;
  }

  remove(): void {
    const datasToRemove = this.allDatas.filter(data => data.checked).map(m => m.id);
    const tagsToReplace = this.tags.filter(t => t.datas.filter(d => d.movie === this.isMovie).map(m => m.id).some(id => datasToRemove.includes(id)));
    tagsToReplace.forEach(t => t.datas = t.datas.filter(data => !datasToRemove.includes(data.id) || data.movie !== this.isMovie));
    this.myDatasService.remove(datasToRemove, this.isMovie)
      .then(() => {
        this.allDatas = this.allDatas.filter(data => !data.checked);
        this.paginate(this.refreshData());
        if (tagsToReplace && tagsToReplace.length > 0) {
          this.myTagsService.replaceTags(tagsToReplace);
        }
      });
    this.nbChecked = 0;
    this.onTop();
  }

  expand(element: T): void {
    this.expandedElement = this.expandedElement === element ? undefined : element;
    if (this.expandedElement) {
      this.displayedTags.next(this.tags.filter(t => t.datas.filter(d => d.movie === this.isMovie).map(m => m.id).includes(this.expandedElement.id)));
    }
  }

  addTag(): void {
    let selectedDatasIds = this.allDatas.filter(data => data.checked).map(data => data.id);
    selectedDatasIds = selectedDatasIds.filter(id => !this.selectedTag.datas.filter(d => d.movie === this.isMovie).map(m => m.id).includes(id));
    if (selectedDatasIds.length > 0) {
      this.selectedTag.datas.push(...selectedDatasIds.map(id =>
        TagData.fromData(this.allDatas.find(m => m.id === id), this.isMovie)
      ));
      this.myTagsService.updateTag(this.selectedTag).then(() => {
        this.nbChecked = 0;
        this.selectedTag = undefined;
        this.allDatas.forEach(m => m.checked = false);
      });
    } else {
      this.toast.open(Level.warning, 'toast.already_added');
      this.nbChecked = 0;
      this.selectedTag = undefined;
      this.allDatas.forEach(m => m.checked = false);
    }
  }

  onTop(): void {
    this.elemRef.nativeElement.querySelector('.filters').scrollIntoView();
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
