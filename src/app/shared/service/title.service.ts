import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { Utils } from '../utils';

@Injectable()
export class TitleService {
  header = new BehaviorSubject<string>('');

  constructor(private title: Title, private translate: TranslateService) { }

  setTitle(title: string): void {
    const isEmpty = Utils.isBlank(title);
    this.title.setTitle('AllMovies' + (isEmpty ? '' : (' | ' + this.translate.instant(title))));
    this.header.next(!isEmpty ? this.translate.instant(title) : 'AllMovies');
  }
}
