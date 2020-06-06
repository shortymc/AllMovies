import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, OnChanges } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { SearchService } from './../../../../shared/service/search.service';
import { ImageSize } from '../../../../model/model';

interface IdClass {
  id: any;
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent<T extends IdClass> implements OnInit, OnChanges {
  @Input() adult: boolean;
  @Input() service: SearchService<T>;
  @Input() placeholder: string;
  @Input() initList: any[];
  @Input() clear: boolean;
  @Input() hasImage: boolean;
  @Output() items = new EventEmitter<any[]>();
  imageSize = ImageSize;
  itemCtrl: FormControl;
  filteredItems: Observable<T[]>;
  list: T[] = [];
  faRemove = faTimes;

  constructor() { }

  ngOnInit(): void {
    this.initValues();
    this.itemCtrl = new FormControl();
    this.filteredItems = this.itemCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => term
          ? this.service.search(term, this.adult)
          : of<T[]>([])),
        catchError(error => {
          console.error(error);
          return of<T[]>([]);
        }));
  }

  initValues(): void {
    if (this.initList) {
      const obs = [];
      this.initList.map((id: any) => {
        obs.push(this.service.byId(id));
      });
      forkJoin(obs).subscribe(
        (data: T[]) => {
          this.list = data;
        });
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const field of Object.keys(changes)) {
      if (field === 'clear') {
        const changedProp = changes[field];
        this.clear = changedProp.currentValue;
        if (this.clear) {
          this.list = [];
        }
      } else if (field === 'initList') {
        this.initList = changes[field].currentValue;
        this.initValues();
      }
    }
  }

  addItem(item: T): void {
    this.list.push(item);
    this.items.emit(this.list.map(element => element.id));
  }

  removeItem(item: T): void {
    const index = this.list.indexOf(item);

    if (index >= 0) {
      this.list.splice(index, 1);
    }
    this.items.emit(this.list.map(element => element.id));
  }

}
