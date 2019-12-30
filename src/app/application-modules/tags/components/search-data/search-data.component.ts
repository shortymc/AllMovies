import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { Data } from './../../../../model/data';
import { DetailConfig } from './../../../../model/model';
import { SerieService, MovieService, MovieSearchService } from './../../../../shared/shared.module';

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss']
})
export class SearchDataComponent<T extends Data> implements OnInit {
  @ViewChild('inputSearch', { static: true })
  inputSearch: ElementRef;
  @Input() adult: boolean;
  @Output() selected = new EventEmitter<T[]>();
  @Output() movie = new EventEmitter<boolean>();
  filteredDatas: Observable<T[]>;
  dataCtrl: FormControl;
  faRemove = faTimes;
  isMovie = true;

  constructor(
    private movieSearchService: MovieSearchService,
    private movieService: MovieService,
    private serieService: SerieService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.dataCtrl = new FormControl();
    this.filteredDatas = this.dataCtrl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(term => {
          if (term) {
            return this.isMovie ?
              this.movieSearchService.search(term, this.adult, this.translate.currentLang) :
              this.serieService.search(term, this.translate.currentLang);
          } else {
            return of([]);
          }
        }),
        catchError(error => {
          console.error(error);
          return of([]);
        }));
  }

  switch(): void {
    this.dataCtrl.setValue(this.inputSearch.nativeElement.value);
    this.inputSearch.nativeElement.click();
  }

  add(item: T): void {
    const lang = this.translate.currentLang === 'fr' ? 'en' : 'fr';
    item.lang_version = this.translate.currentLang;
    const config = new DetailConfig(false, false, false, false, false, false, false, false, false, lang);
    new Promise(resolve => {
      if (this.isMovie) {
        this.movieService.getMovie(item.id, config, false).then(resolve);
      } else {
        this.serieService.getSerie(item.id, config, false).then(resolve);
      }
    }).then((data: T) => {
      data.lang_version = lang;
      this.movie.emit(this.isMovie);
      this.selected.emit([item, data]);
    });
  }
}
