import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TitleService {
  header = new BehaviorSubject<string>('');

  constructor(private title: Title, private translate: TranslateService) { }

  setTitle(title: string): void {
    this.title.setTitle(title || title.trim() !== '' ? 'AllMovies | ' + this.translate.instant(title) : 'AllMovies');
    this.header.next(title || title.trim() !== '' ? this.translate.instant(title) : 'AllMovies');
  }
}
