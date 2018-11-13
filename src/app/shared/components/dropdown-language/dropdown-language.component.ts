import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';

import { LangService } from './../../service/lang.service';
import { AuthService } from './../../service/auth.service';
import { Lang } from '../../../model/model';

@Component({
  selector: 'app-dropdown-language',
  templateUrl: './dropdown-language.component.html',
  styleUrls: ['./dropdown-language.component.scss']
})
export class DropdownLanguageComponent implements OnInit {
  @Input()
  userLang: boolean;
  @Output()
  lang = new EventEmitter<Lang>();
  language: Lang;
  langList: Lang[];

  constructor(
    private translate: TranslateService,
    private langService: LangService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.langService.getAll().then(langs => {
      this.langList = langs;
      if (this.userLang) {
        this.auth.isLogged.pipe(distinctUntilChanged()).subscribe(isLogged => {
          if (isLogged) {
            this.auth.getCurrentUser().then(user => {
              this.language = this.langList.find(l => l.code === user.lang.code);
            });
          } else {
            this.language = undefined;
          }
        });
      } else {
        this.language = this.langList.find(l => l.code === this.translate.getBrowserLang());
      }
    });
  }

  change(language: Lang): void {
    this.language = language;
    this.translate.use(language.code);
    this.lang.emit(language);
  }

}
