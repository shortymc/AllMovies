import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TitleService {
  header = new BehaviorSubject<string>('');

  constructor(private title: Title, private translate: TranslateService) { }

  setTitle(title: string): void {
    title || title.trim() !== '' ? this.title.setTitle('AllMovies | ' + this.translate.instant(title)) : this.title.setTitle('AllMovies');
    this.header.next(this.title.getTitle());
  }
}
