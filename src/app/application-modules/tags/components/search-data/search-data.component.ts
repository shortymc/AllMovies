import {FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of, forkJoin} from 'rxjs';
import {debounceTime, switchMap, catchError} from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import {Data} from './../../../../model/data';
import {DetailConfig, ImageSize} from './../../../../model/model';
import {
  SerieService,
  MovieService,
  MovieSearchService,
} from './../../../../shared/shared.module';

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent<T extends Data> implements OnInit {
  @ViewChild('inputSearch', {static: true})
  inputSearch!: ElementRef;
  @Input() adult!: boolean;
  @Output() selected = new EventEmitter<T[]>();
  @Output() movie = new EventEmitter<boolean>();
  filteredDatas!: Observable<T[]>;
  dataCtrl!: FormControl;
  imageSize = ImageSize;
  faRemove = faTimes;
  isMovie = true;

  constructor(
    private movieSearchService: MovieSearchService,
    private movieService: MovieService,
    private serieService: SerieService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.dataCtrl = new FormControl();
    this.filteredDatas = this.dataCtrl.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        if (term) {
          return this.isMovie
            ? this.movieSearchService.search(
                term,
                this.adult,
                this.translate.currentLang
              )
            : this.serieService.search(term, this.translate.currentLang);
        } else {
          return of([]);
        }
      }),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  switch(): void {
    this.dataCtrl.setValue(this.inputSearch.nativeElement.value);
    this.inputSearch.nativeElement.click();
  }

  add(item: T): void {
    const lang = this.translate.currentLang === 'fr' ? 'en' : 'fr';
    forkJoin([
      this.fetchData(item.id, lang, this.isMovie),
      this.fetchData(item.id, this.translate.currentLang, this.isMovie),
    ]).subscribe((data: T[]) => {
      this.movie.emit(this.isMovie);
      this.selected.emit(data);
    });
  }

  fetchData(id: number, lang: string, isMovie: boolean): Promise<T> {
    const config = new DetailConfig(
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      !isMovie,
      lang
    );
    let result: Promise<Data>;
    if (this.isMovie) {
      result = this.movieService.getMovie(id, config, false);
    } else {
      result = this.serieService.getSerie(id, config, false);
    }
    return result.then((d: T) => {
      d.lang_version = lang;
      return d;
    });
  }
}
