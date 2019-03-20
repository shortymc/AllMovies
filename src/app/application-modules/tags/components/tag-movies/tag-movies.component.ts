import { FormGroup } from '@angular/forms';
import { faTrash, faHashtag, faList } from '@fortawesome/free-solid-svg-icons';
import { PageEvent, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { Utils } from './../../../../shared/utils';
import { MyTagsService } from './../../../../shared/service/my-tags.service';
import { MenuService } from './../../../../shared/service/menu.service';
import { Tag, TagMovie } from './../../../../model/tag';

@Component({
  selector: 'app-tag-movies',
  templateUrl: './tag-movies.component.html',
  styleUrls: ['./tag-movies.component.scss']
})
export class TagMoviesComponent implements OnChanges {
  @Input() tag: Tag;
  @Input() visible: boolean;
  displayedColumns = ['id', 'title', 'select'];
  length: number;
  displayedData: TagMovie[];
  filter: string;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  page: PageEvent;
  sort: Sort;
  nbChecked = 0;
  tagForm: FormGroup;
  subs = [];

  faTrash = faTrash;
  faHashtag = faHashtag;
  faList = faList;
  faSave = faSave;

  constructor(
    private menuService: MenuService,
    private myTagsService: MyTagsService,
    private translate: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tag = changes.tag ? changes.tag.currentValue : this.tag;
    this.visible = changes.visible ? changes.visible.currentValue : this.visible;
    this.menuService.visible$.next(!this.visible);
    if (this.visible) {
      this.displayedData = this.tag.movies;
      if (this.page) {
        this.page.pageIndex = 0;
        this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
      }
      this.length = this.tag.movies.length;
      this.paginate(this.refreshData());
    }
  }

  refreshData(): Tag {
    let data = { ...this.tag };
    data.movies = Array.from(this.tag.movies);
    data.movies = data.movies.filter(movie => movie.lang_version === this.translate.currentLang);
    data.movies = Utils.filterByFields(data.movies, this.displayedColumns, this.filter);
    data = Utils.sortTagMovies(data, this.sort);
    this.length = data.movies.length;
    return data;
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
    this.displayedData = this.page ?
      data.movies.slice(this.page.pageIndex * this.page.pageSize, (this.page.pageIndex + 1) * this.page.pageSize)
      : data.movies.slice(0, this.pageSize);
  }

  initPagination(data: Tag): void {
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.paginate(data);
  }

  addMovie(movies: TagMovie[]): void {
    this.tag.movies.push(...movies);
    this.initPagination(this.refreshData());
  }

  removeMovie(): void {
    const toRemove = this.tag.movies.filter(movie => movie.checked).map(movie => movie.id);
    this.tag.movies = this.tag.movies.filter(movie => !toRemove.includes(movie.id));
    this.nbChecked = 0;
    this.initPagination(this.refreshData());
  }

  save(): void {
    this.myTagsService.updateMovies(this.tag);
  }

  updateSize(): void {
    this.nbChecked = this.tag.movies.filter(movie => movie.checked).length;
  }

}
