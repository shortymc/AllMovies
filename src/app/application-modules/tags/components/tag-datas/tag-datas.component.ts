import { FormGroup } from '@angular/forms';
import { faTrash, faList, faPen, faPaintBrush, faImage } from '@fortawesome/free-solid-svg-icons';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnChanges, Input, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { Utils } from './../../../../shared/utils';
import { MyDatasService, MyTagsService, AuthService, MenuService, ToastService } from './../../../../shared/shared.module';
import { Data } from './../../../../model/data';
import { Level, ImageSize } from './../../../../model/model';
import { Tag, TagData } from './../../../../model/tag';

@Component({
  selector: 'app-tag-datas',
  templateUrl: './tag-datas.component.html',
  styleUrls: ['./tag-datas.component.scss']
})
export class TagDatasComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tag: Tag;
  @Input() visible: boolean;
  displayedColumns = ['poster', 'title', 'select'];
  length: number;
  displayedData: TagData[];
  allSeries: Data[];
  allMovies: Data[];
  isMovie: boolean;
  search = '';
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  page: PageEvent;
  sort: Sort;
  nbChecked = 0;
  tagForm: FormGroup;
  edit = false;
  edited = false;
  adult: boolean;
  editedLabel: string;
  editedColor: string;
  moviesToAdd: Data[] = [];
  seriesToAdd: Data[] = [];
  subs = [];

  imageSize = ImageSize;
  faTrash = faTrash;
  faImage = faImage;
  faList = faList;
  faSave = faSave;
  faEdit = faPen;
  faBrush = faPaintBrush;

  constructor(
    private menuService: MenuService,
    private myTagsService: MyTagsService,
    private myDatasService: MyDatasService<Data>,
    public translate: TranslateService,
    private toast: ToastService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.auth.user$.subscribe(user => {
      if (user) {
        this.adult = user.adult;
      }
    }));
    this.subs.push(this.myDatasService.myMovies$.subscribe(movies => {
      if (movies) {
        this.allMovies = movies;
      }
    }));
    this.subs.push(this.myDatasService.mySeries$.subscribe(series => {
      if (series) {
        this.allSeries = series;
      }
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tag = changes.tag.currentValue ? Tag.clone(<Tag>changes.tag.currentValue) : this.tag;
    this.visible = changes.visible ? changes.visible.currentValue : this.visible;
    this.menuService.visible$.next(!this.visible);
    if (this.visible) {
      this.initData();
      if (this.page) {
        this.page.pageIndex = 0;
        this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
      }
    } else {
      this.displayedData = [];
    }
    this.paginate(this.refreshData());
  }

  initData(): void {
    this.displayedData = this.tag.datas;
    this.edited = false;
    this.search = '';
    this.nbChecked = 0;
    this.editedColor = this.tag.color;
    this.displayedData.forEach(t => t.checked = false);
    this.length = this.tag.datas.length;
    this.edit = false;
  }

  refreshData(): Tag {
    if (this.tag && this.tag.datas && this.tag.datas.length > 0) {
      let data = { ...this.tag };
      data.datas = Array.from(this.tag.datas);
      data.datas = Utils.filterByFields(data.datas, this.displayedColumns, this.search);
      data = Utils.sortTagDatas(data, this.sort, this.translate.currentLang);
      this.length = data.datas.length;
      return data;
    } else {
      return undefined;
    }
  }

  onSearch(): void {
    this.initPagination(this.refreshData());
  }

  onSort(): void {
    this.initPagination(this.refreshData());
  }

  onPaginateChange(): void {
    this.paginate(this.refreshData());
  }

  paginate(data: Tag): void {
    if (data) {
      this.displayedData = this.page ?
        data.datas.slice(this.page.pageIndex * this.page.pageSize, (this.page.pageIndex + 1) * this.page.pageSize)
        : data.datas.slice(0, this.pageSize);
    } else {
      this.displayedData = [];
    }
  }

  initPagination(data: Tag): void {
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.paginate(data);
  }

  addData(datas: Data[]): void {
    const tagData = TagData.fromData(datas, this.isMovie);
    if (this.tag.datas.find(m => m.id === tagData.id && m.movie === tagData.movie)) {
      this.toast.open(Level.warning, 'toast.already_added');
    } else {
      this.tag.datas.push(tagData);
      this.initPagination(this.refreshData());
      this.edited = true;
      if (this.isMovie) {
        this.moviesToAdd.push(...datas);
      } else {
        this.seriesToAdd.push(...datas);
      }
    }
  }

  removeData(): void {
    const toRemove = this.tag.datas.filter(data => data.checked);

    const movieToRemove = toRemove.filter(data => data.movie).map(data => data.id);
    this.moviesToAdd = this.moviesToAdd.filter(data => !movieToRemove.includes(data.id));
    const serieToRemove = toRemove.filter(data => !data.movie).map(data => data.id);
    this.seriesToAdd = this.seriesToAdd.filter(data => !serieToRemove.includes(data.id));

    this.tag.datas = this.tag.datas.filter(data => !toRemove.filter(d => d.movie === data.movie).find(d => d.id === data.id));

    this.nbChecked = 0;
    this.initPagination(this.refreshData());
    this.edited = true;
  }

  saveData(allDatas: Data[], datasToAdd: Data[], isMovie: boolean): Promise<boolean> {
    return new Promise(resolve => {
      const toAdd = datasToAdd.filter(movie => !allDatas.map(m => m.id).includes(movie.id));
      if (toAdd && toAdd.length > 0) {
        this.myDatasService.add(toAdd, isMovie).then(() => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  save(): void {
    this.edited = false;
    this.saveData(this.allMovies, this.moviesToAdd, true)
      .then(() => this.saveData(this.allSeries, this.seriesToAdd, false))
      .then(() => {
        this.moviesToAdd = [];
        this.seriesToAdd = [];
        this.myTagsService.updateTag(this.tag);
      });
  }

  toogleEdit(): void {
    if (this.edit && (this.editedLabel !== this.tag.label || this.editedColor !== this.tag.color)) {
      this.editTag();
    } else {
      this.editedLabel = this.tag.label;
      this.editedColor = this.tag.color;
      this.edit = !this.edit;
    }
  }

  editTag(): void {
    this.edit = false;
    this.tag.label = this.editedLabel;
    this.tag.color = this.editedColor;
    this.edited = true;
  }

  updateSize(): void {
    this.nbChecked = this.tag.datas.filter(data => data.checked).length;
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
