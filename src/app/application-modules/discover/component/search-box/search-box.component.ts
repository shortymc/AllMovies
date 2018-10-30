import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, OnChanges } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { SearchServiceService } from './../../../../shared/service/searchService.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent<T> implements OnInit, OnChanges {
  @Input() adult: boolean;
  @Input() service: SearchServiceService<T>;
  @Input() placeholder: string;
  @Input() initList: T[];
  @Input() clear: boolean;
  @Output() items = new EventEmitter<T[]>();
  itemCtrl: FormControl;
  filteredItems: Observable<T[]>;
  list: T[] = [];
  faRemove = faTimes;

  constructor() { }

  ngOnInit() {
    if (this.initList) {
      this.list = this.initList;
    }
    this.itemCtrl = new FormControl();
    this.filteredItems = this.itemCtrl.valueChanges
      .debounceTime(300).distinctUntilChanged().switchMap(term => term
        ? this.service.search(term, this.adult)
        : Observable.of<T[]>([]))
      .catch(error => {
        console.error(error);
        return Observable.of<T[]>([]);
      });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const field of Object.keys(changes)) {
      if (field === 'clear') {
        const changedProp = changes[field];
        this.clear = changedProp.currentValue;
        if (this.clear) {
          this.list = [];
        }
      }
    }
  }

  addItem(item: T) {
    this.list.push(item);
    this.items.emit(this.list);
  }

  removeItem(item: T): void {
    const index = this.list.indexOf(item);

    if (index >= 0) {
      this.list.splice(index, 1);
    }
  }

}
