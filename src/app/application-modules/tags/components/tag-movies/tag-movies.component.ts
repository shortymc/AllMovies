import { FormGroup } from '@angular/forms';
import { faTrash, faList, faPen, faPaintBrush, faImage } from '@fortawesome/free-solid-svg-icons';
import { PageEvent, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnChanges, Input, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { Utils } from './../../../../shared/utils';
import { MyDatasService } from './../../../../shared/shared.module';
import { Movie } from './../../../../model/movie';
import { MyTagsService } from './../../../../shared/service/my-tags.service';
import { AuthService } from './../../../../shared/service/auth.service';
import { Level } from './../../../../model/model';
import { MenuService } from './../../../../shared/service/menu.service';
import { ToastService } from './../../../../shared/service/toast.service';
import { Tag, TagMovie } from './../../../../model/tag';

@Component({
  selector: 'app-tag-movies',
  templateUrl: './tag-movies.component.html',
  styleUrls: ['./tag-movies.component.scss']
})
export class TagMoviesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tag: Tag;
  @Input() visible: boolean;
  displayedColumns = ['poster', 'title', 'select'];
  length: number;
  displayedData: TagMovie[];
  allMovies: Movie[];
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
  moviesToAdd: Movie[] = [];
  subs = [];

  faTrash = faTrash;
  faImage = faImage;
  faList = faList;
  faSave = faSave;
  faEdit = faPen;
  faBrush = faPaintBrush;

  constructor(
    private menuService: MenuService,
    private myTagsService: MyTagsService,
    private myDatasService: MyDatasService<Movie>,
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
    this.subs.push(this.myDatasService.myDatas$.subscribe(movies => {
      if (movies) {
        this.allMovies = movies;
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
    this.displayedData = this.tag.movies;
    this.edited = false;
    this.search = '';
    this.nbChecked = 0;
    this.editedColor = this.tag.color;
    this.displayedData.forEach(t => t.checked = false);
    this.length = this.tag.movies.length;
    this.edit = false;
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

  addMovie(movies: Movie[]): void {
    const tag = TagMovie.fromMovie(movies);
    if (this.tag.movies.map(m => m.id).includes(tag.id)) {
      this.toast.open(Level.warning, 'toast.already_added');
    } else {
      this.tag.movies.push(tag);
      this.initPagination(this.refreshData());
      this.edited = true;
      this.moviesToAdd.push(...movies);
    }
  }

  removeMovie(): void {
    const toRemove = this.tag.movies.filter(movie => movie.checked).map(movie => movie.id);
    this.tag.movies = this.tag.movies.filter(movie => !toRemove.includes(movie.id));
    this.moviesToAdd = this.moviesToAdd.filter(movie => !toRemove.includes(movie.id));
    this.nbChecked = 0;
    this.initPagination(this.refreshData());
    this.edited = true;
  }

  save(): void {
    this.edited = false;
    new Promise(resolve => {
      this.moviesToAdd = this.moviesToAdd.filter(movie => !this.allMovies.map(m => m.id).includes(movie.id));
      if (this.moviesToAdd && this.moviesToAdd.length > 0) {
        this.myDatasService.add(this.moviesToAdd, true).then(() => {
          this.moviesToAdd = [];
          resolve(true);
        });
      } else {
        this.moviesToAdd = [];
        resolve(true);
      }
    }).then(() => this.myTagsService.updateTag(this.tag));
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
    this.nbChecked = this.tag.movies.filter(movie => movie.checked).length;
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
