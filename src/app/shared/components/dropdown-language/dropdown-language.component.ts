import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-language',
  templateUrl: './dropdown-language.component.html',
  styleUrls: ['./dropdown-language.component.scss']
})
export class DropdownLanguageComponent implements OnInit {
  language: string;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.language = this.translate.getBrowserLang();
  }

  change(language: string): void {
    this.language = language;
    this.translate.use(language);
  }

}
