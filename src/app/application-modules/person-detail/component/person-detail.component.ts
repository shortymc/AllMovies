import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { PersonService, TitleService } from '../../../shared/shared.module';
import { Person } from '../../../model/person';
import { Url } from '../../../constant/url';
import { DuckDuckGo } from '../../../constant/duck-duck-go';

@Component({
  selector: 'app-person-detail',
  styleUrls: ['./person-detail.component.scss'],
  templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
  person: Person;
  isImagesCollapsed = false;
  Url = Url;
  DuckDuckGo = DuckDuckGo;

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private translate: TranslateService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getPerson(id, this.translate.currentLang);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getPerson(this.person.id, event.lang);
    });
  }

  getPerson(id: number, language: string) {
    this.personService.getPerson(id, language)
      .then(person => {
        this.person = person;
        this.title.setTitle(person.name);
      });
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }
}
