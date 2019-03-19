import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {
  faTrash, faHashtag, faList, faChevronCircleRight
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
  displayedColumns = ['id', 'label', 'count', 'select'];
  tags: Tag[];
  length: number;
  displayedTags: Tag[];
  filter: string;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  page: PageEvent;
  sort: Sort;
  nbChecked = 0;
  scrollTo: HTMLElement;
  tagForm: FormGroup;
  subs = [];

  faTrash = faTrash;
  faHashtag = faHashtag;
  faList = faList;
  faStar = faStar;
  faChevronCircleRight = faChevronCircleRight;

  constructor(
    private myTagsService: MyTagsService,
    private translate: TranslateService,
    private elemRef: ElementRef,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.tabs');
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
      resolve(this.tags.map(tag => tag.label.toLowerCase()).find(label => label === control.value.toLowerCase()) ? { unique: true } : undefined));
  }

  getTags(lang: string): void {
    this.myTagsService.myTags$.subscribe((tags: Tag[]) => {
      this.tags = tags.map(tag => {
        tag.movies = tag.movies.filter(movie => movie.lang_version === lang);
        return tag;
      });
      this.length = this.tags.length;
      this.paginate(this.refreshData());
    });
  }

  refreshData(): Tag[] {
    const list = Utils.sortTags(
      Utils.filterByFields(this.tags, this.displayedColumns, this.filter),
      this.sort);
    this.length = list.length;
    return list;
  }

  onSearch(): void {
    this.initPagination(this.refreshData());
    this.onTop();
  }

  onSort(): void {
    this.initPagination(this.refreshData());
    this.onTop();
  }

  onPaginateChange(): void {
    this.paginate(this.refreshData());
    this.onTop();
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

  remove(): void {
    // this.auth.getFileName().then((fileName) => {
    //   this.myMoviesService.remove(this.movies.filter(movie => movie.checked).map(movie => movie.id), fileName);
    // });
    this.nbChecked = 0;
    this.onTop();
  }

  onTop(): void {
    this.elemRef.nativeElement.querySelector('.filters').scrollIntoView();
  }

  updateSize(): void {
    this.nbChecked = this.tags.filter(tag => tag.checked).length;
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

}
