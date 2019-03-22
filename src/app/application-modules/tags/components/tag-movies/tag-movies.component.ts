import { FormGroup } from '@angular/forms';
import { faTrash, faHashtag, faList, faEdit } from '@fortawesome/free-solid-svg-icons';
import { PageEvent, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { Utils } from './../../../../shared/utils';
import { MyTagsService } from './../../../../shared/service/my-tags.service';
import { Level } from './../../../../model/model';
import { MenuService } from './../../../../shared/service/menu.service';
import { ToastService } from './../../../../shared/service/toast.service';
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
  search = '';
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  page: PageEvent;
  sort: Sort;
  nbChecked = 0;
  tagForm: FormGroup;
  edit = false;
  editedLabel: string;
  subs = [];

  faTrash = faTrash;
  faHashtag = faHashtag;
  faList = faList;
  faSave = faSave;
  faEdit = faEdit;

  constructor(
    private menuService: MenuService,
    private myTagsService: MyTagsService,
    public translate: TranslateService,
    private toast: ToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tag = changes.tag.currentValue ? Tag.clone(<Tag>changes.tag.currentValue) : this.tag;
    this.visible = changes.visible ? changes.visible.currentValue : this.visible;
    this.menuService.visible$.next(!this.visible);
    if (this.visible) {
      this.displayedData = this.tag.movies;
      if (this.page) {
        this.page.pageIndex = 0;
        this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
      }
      this.length = this.tag.movies.length;
    } else {
      this.displayedData = [];
    }
    this.paginate(this.refreshData());
  }

  refreshData(): Tag {
    if (this.tag && this.tag.movies && this.tag.movies.length > 0) {
      let data = { ...this.tag };
      data.movies = Array.from(this.tag.movies);
      data.movies = Utils.filterByFields(data.movies, this.displayedColumns, this.search);
      data = Utils.sortTagMovies(data, this.sort, this.translate.currentLang);
      this.length = data.movies.length;
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
        data.movies.slice(this.page.pageIndex * this.page.pageSize, (this.page.pageIndex + 1) * this.page.pageSize)
        : data.movies.slice(0, this.pageSize);
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

  addMovie(movie: TagMovie): void {
    if (this.tag.movies.map(m => m.id).includes(movie.id)) {
      this.toast.open('toast.already_added', Level.warning);
    } else {
      this.tag.movies.push(movie);
      this.initPagination(this.refreshData());
    }
  }

  removeMovie(): void {
    const toRemove = this.tag.movies.filter(movie => movie.checked).map(movie => movie.id);
    this.tag.movies = this.tag.movies.filter(movie => !toRemove.includes(movie.id));
    this.nbChecked = 0;
    this.initPagination(this.refreshData());
  }

  save(): void {
    this.myTagsService.updateTag(this.tag);
  }

  toogleEdit(): void {
    if (this.edit && this.editedLabel !== this.tag.label) {
      this.editTag();
    } else {
      this.editedLabel = this.tag.label;
      this.edit = !this.edit;
    }
  }

  editTag(): void {
    this.edit = false;
    this.tag.label = this.editedLabel;
  }

  updateSize(): void {
    this.nbChecked = this.tag.movies.filter(movie => movie.checked).length;
  }

}
