import {TranslateService} from '@ngx-translate/core';
import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SortDirection} from '@angular/material/sort';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';

import {Data} from '../../../model/data';
import {Utils} from '../../utils';
import {DropDownChoice, ImageSize} from '../../../model/model';

@Component({
  selector: 'app-list-datas',
  templateUrl: './list-datas.component.html',
  styleUrls: ['./list-datas.component.scss'],
})
export class ListDatasComponent<T extends Data> implements OnChanges {
  @Input()
  datas: T[] = [];
  @Input()
  isMovie!: boolean;
  @Input()
  label!: string;

  imageSize = ImageSize;
  page!: number;
  research!: string;
  resultLength!: number;
  datasToShow: T[] = [];
  sortChoices: DropDownChoice[] = [];
  sortChosen!: DropDownChoice;
  sortDir!: SortDirection;
  pageSize = 5;

  constructor(public translate: TranslateService, library: FaIconLibrary) {
    library.addIcons(faTimesCircle);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    for (const field of Object.keys(changes)) {
      if (field === 'datas') {
        this.datas = changes[field].currentValue;
        this.initSortProperties();
        this.sortOrSearchChanged();
      }
    }
  }

  getDatasToShow(datas: T[], page: number): void {
    let list = datas;
    if (this.research && this.research.trim() !== '') {
      list = Utils.filterByFields(datas, ['title'], this.research);
    }
    this.resultLength = list.length;
    this.datasToShow = list.slice(
      (page - 1) * this.pageSize,
      page * this.pageSize
    );
  }

  sortOrSearchChanged(): void {
    this.datas = Utils.sortData(this.datas, {
      active: this.sortChosen.value,
      direction: this.sortDir,
    });
    this.page = 1;
    this.getDatasToShow(this.datas, this.page);
  }

  initSortProperties(): void {
    if (!this.sortDir) {
      this.sortDir = 'desc';
    }
    if (!this.sortChoices || this.sortChoices.length === 0) {
      this.sortChoices = [
        new DropDownChoice('discover.sort_field.popularity', 'popularity'),
        new DropDownChoice('discover.sort_field.release_date', 'date'),
        new DropDownChoice('discover.sort_field.original_title', 'title'),
        new DropDownChoice('discover.sort_field.vote_average', 'vote'),
        new DropDownChoice('discover.sort_field.vote_count', 'vote_count'),
      ];
      if (!this.isMovie) {
        this.sortChoices.splice(
          1,
          1,
          new DropDownChoice('discover.sort_field.first_air_date', 'firstAired')
        );
      }
    }
    if (!this.sortChosen) {
      this.sortChosen = this.sortChoices[0];
    }
  }
}
