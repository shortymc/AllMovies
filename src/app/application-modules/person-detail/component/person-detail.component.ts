import { Component, OnInit, AfterViewChecked, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { faAtom, faChevronCircleLeft, faPlusSquare, faMinusSquare, faImage } from '@fortawesome/free-solid-svg-icons';

import { PersonService, TitleService } from '../../../shared/shared.module';
import { Person } from '../../../model/person';
import { Url } from '../../../constant/url';
import { DuckDuckGo } from '../../../constant/duck-duck-go';

@Component({
  selector: 'app-person-detail',
  styleUrls: ['./person-detail.component.scss'],
  templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit, AfterViewChecked {
  person: Person;
  isImagesVisible = false;
  scrollTo: HTMLElement;

  Url = Url;
  DuckDuckGo = DuckDuckGo;
  faAtom = faAtom;
  faChevronCircleLeft = faChevronCircleLeft;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  faImage = faImage;

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private translate: TranslateService,
    private title: TitleService,
    private elemRef: ElementRef,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getPerson(+params.get('id'), this.translate.currentLang);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getPerson(this.person.id, event.lang);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollTo = this.elemRef.nativeElement.querySelector('h2');
    this.cdRef.detectChanges();
  }

  getPerson(id: number, language: string): void {
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
