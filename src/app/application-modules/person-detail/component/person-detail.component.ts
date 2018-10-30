import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { faAtom } from '@fortawesome/free-solid-svg-icons';

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
  faAtom = faAtom;

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private translate: TranslateService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getPerson(+params.get('id'), this.translate.currentLang);
    });
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

  discover(): void {
    sessionStorage.setItem('people', JSON.stringify([this.person]));
    this.router.navigate(['discover']);
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }
}
