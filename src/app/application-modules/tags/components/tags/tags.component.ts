import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {
  faTrash, faHashtag, faList, faChevronCircleRight, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle, faStar } from '@fortawesome/free-regular-svg-icons';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { MyTagsService } from './../../../../shared/service/my-tags.service';
import { Utils } from './../../../../shared/utils';
import { TitleService } from './../../../../shared/service/title.service';
import { Tag } from './../../../../model/tag';

library.add(faTimesCircle);

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  displayedColumns = ['id', 'label', 'count', 'select', 'details'];
  tags: Tag[];
  tableTags: Tag[];
  length: number;
  displayedTags: Tag[];
  search = '';
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  page: PageEvent;
  sort: Sort;
  nbChecked = 0;
  tagForm: FormGroup;
  isMoviesVisible = false;
  selectedTag: Tag;
  subs = [];

  faTrash = faTrash;
  faHashtag = faHashtag;
  faPlus = faPlus;
  faList = faList;
  faStar = faStar;
  faChevronCircleRight = faChevronCircleRight;

  constructor(
    private myTagsService: MyTagsService,
    private translate: TranslateService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.tags');
    this.myTagsService.getAll();
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.getTags(this.translate.currentLang);
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getTags(event.lang);
    }));
    this.tagForm = new FormGroup({
      toAdd: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(20)],
        asyncValidators: [this.isTagUnique.bind(this)],
        updateOn: 'change'
      })
    });
  }

  get toAdd(): AbstractControl { return this.tagForm.get('toAdd'); }

  isTagUnique(control: AbstractControl): Promise<any> {
    return new Promise(resolve =>
      resolve(this.tableTags.map(tag => tag.label.toLowerCase()).find(label => label === control.value.toLowerCase())
        ? { unique: true } : undefined));
  }

  getTags(lang: string): void {
    this.myTagsService.myTags$.subscribe((tags: Tag[]) => {
      this.tags = tags;
      this.tableTags = tags.map(tag => {
        const clone = Tag.clone(tag);
        clone.movies = clone.movies.filter(movie => movie.lang_version === lang);
        return clone;
      });
      this.length = this.tableTags.length;
      this.paginate(this.refreshData());
    });
  }

  refreshData(): Tag[] {
    const list = Utils.sortTags(
      Utils.filterByFields(this.tableTags, ['id', 'label', 'count'], this.search),
      this.sort);
    this.length = list.length;
    return list;
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

  paginate(data: Tag[]): void {
    this.displayedTags = this.page ?
      data.slice(this.page.pageIndex * this.page.pageSize, (this.page.pageIndex + 1) * this.page.pageSize) : data.slice(0, this.pageSize);
  }

  initPagination(list: Tag[]): void {
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.paginate(list);
  }

  addTag(): void {
    const tag = new Tag();
    tag.label = this.toAdd.value;
    tag.movies = [];
    this.myTagsService.add(tag);
  }

  selectTag(selected: Tag): void {
    this.selectedTag = this.tags.find(tag => tag.id === selected.id);
    this.isMoviesVisible = true;
  }

  remove(): void {
    this.myTagsService.remove(this.tableTags.filter(tag => tag.checked).map(tag => tag.id));
    this.nbChecked = 0;
  }

  updateSize(): void {
    this.nbChecked = this.tableTags.filter(tag => tag.checked).length;
  }

  updateModal(visible: boolean): void {
    this.isMoviesVisible = visible;
    if (!visible) {
      this.selectedTag = undefined;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

}
