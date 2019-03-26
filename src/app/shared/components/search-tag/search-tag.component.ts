import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Utils } from './../../utils';
import { Tag } from './../../../model/tag';
import { MyTagsService } from '../../service/my-tags.service';

@Component({
  selector: 'app-search-tag',
  templateUrl: './search-tag.component.html',
  styleUrls: ['./search-tag.component.scss']
})
export class SearchTagComponent implements OnInit {
  @Output() selected = new EventEmitter<Tag>();
  filteredTags: Observable<Tag[]>;
  tagCtrl: FormControl;
  faRemove = faTimes;
  faPlus = faPlus;

  constructor(
    private myTagsService: MyTagsService,
  ) { }

  ngOnInit(): void {
    this.tagCtrl = new FormControl();
    this.filteredTags = this.tagCtrl.valueChanges.
      pipe(
        startWith(''),
        switchMap((term: any) => this.myTagsService.myTags$.pipe(map((tags: Tag[]) =>
          term && typeof term === 'string' && term !== '' ?
            tags.filter(tag => tag.label.toLowerCase().includes(term.toLowerCase())) : tags))));
  }

  add(item: string): void {
    const tag = new Tag();
    tag.label = item;
    tag.movies = [];
    tag.color = Utils.randomColor();
    this.myTagsService.add(tag).then((added) => {
      this.selected.emit(added);
      this.tagCtrl.reset();
    });

  }

  select(item: Tag): void {
    this.selected.emit(item);
    this.tagCtrl.reset();
  }
}
