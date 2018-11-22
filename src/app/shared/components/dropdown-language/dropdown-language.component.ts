import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LangService } from './../../service/lang.service';
import { Lang } from '../../../model/model';

@Component({
  selector: 'app-dropdown-language',
  templateUrl: './dropdown-language.component.html',
  styleUrls: ['./dropdown-language.component.scss']
})
export class DropdownLanguageComponent implements OnInit, OnChanges {
  @Input()
  userLang: Lang;
  @Output()
  lang = new EventEmitter<Lang>();
  language: Lang;
  langList: Lang[];

  constructor(
    private translate: TranslateService,
    private langService: LangService,
  ) { }

  ngOnInit(): void {
    this.langService.getAll().then(langs => {
      this.langList = langs;
      this.updateLang(this.userLang ? this.userLang.code : this.translate.getBrowserLang());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const code = changes.userLang.currentValue ? changes.userLang.currentValue.code : this.translate.getBrowserLang();
    this.updateLang(code);
  }

  updateLang(newCode: string): void {
    this.language = this.langList.find(l => l.code === newCode);
  }

  change(language: Lang): void {
    this.language = language;
    this.translate.use(language.code);
    this.lang.emit(language);
  }

}
