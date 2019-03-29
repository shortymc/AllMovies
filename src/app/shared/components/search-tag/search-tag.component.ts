import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Sort } from '@angular/material';

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
  sort: Sort = { active: 'label', direction: 'asc' };
  alreadyExist = false;

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
        switchMap((term: any) => this.myTagsService.myTags$.pipe(map((tags: Tag[]) => {
          if (term && typeof term === 'string' && term !== '') {
            this.alreadyExist = tags.find(t => t.label.toLowerCase() === term.toLowerCase()) !== undefined;
            return Utils.sortTags(tags.filter(tag => tag.label.toLowerCase().includes(term.toLowerCase())), this.sort);
          } else {
            this.alreadyExist = false;
            return Utils.sortTags(tags, this.sort);
          }
        }))));
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
