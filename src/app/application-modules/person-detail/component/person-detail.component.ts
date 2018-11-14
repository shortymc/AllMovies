import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { faAtom, faChevronCircleLeft, faPlusSquare, faMinusSquare, faImage } from '@fortawesome/free-solid-svg-icons';

import { PersonService, TitleService } from '../../../shared/shared.module';
import { DropDownChoice } from './../../../model/model';
import { Person } from '../../../model/person';
import { Job } from './../../../constant/job';
import { Url } from '../../../constant/url';
import { DuckDuckGo } from '../../../constant/duck-duck-go';

@Component({
  selector: 'app-person-detail',
  styleUrls: ['./person-detail.component.scss'],
  templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
  person: Person;
  isImagesVisible = false;
  scrollTo: HTMLElement;
  listMoviesOrder: DropDownChoice[];

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
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getPerson(+params.get('id'), this.translate.currentLang);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getPerson(this.person.id, event.lang);
    });
  }

  getPerson(id: number, language: string): void {
    this.personService.getPerson(id, language)
      .then(person => {
        this.person = person;
        switch (person.knownFor) {
          case 'Acting':
            this.listMoviesOrder = [
              new DropDownChoice(Job.actor, person.asActor), new DropDownChoice(Job.director, person.asDirector),
              new DropDownChoice(Job.producer, person.asProducer), new DropDownChoice(Job.screenwriter, person.asScreenplay),
              new DropDownChoice(Job.novelist, person.asNovel), new DropDownChoice(Job.composer, person.asCompositors)];
            break;
          case 'Directing':
            this.listMoviesOrder = [
              new DropDownChoice(Job.director, person.asDirector), new DropDownChoice(Job.producer, person.asProducer),
              new DropDownChoice(Job.actor, person.asActor), new DropDownChoice(Job.screenwriter, person.asScreenplay),
              new DropDownChoice(Job.novelist, person.asNovel), new DropDownChoice(Job.composer, person.asCompositors)];
            break;
          case 'Sound':
            this.listMoviesOrder = [
              new DropDownChoice(Job.composer, person.asCompositors), new DropDownChoice(Job.actor, person.asActor),
              new DropDownChoice(Job.director, person.asDirector), new DropDownChoice(Job.producer, person.asProducer),
              new DropDownChoice(Job.screenwriter, person.asScreenplay), new DropDownChoice(Job.novelist, person.asNovel)];
            break;
          case 'Writing':
            this.listMoviesOrder = [
              new DropDownChoice(Job.screenwriter, person.asScreenplay), new DropDownChoice(Job.novelist, person.asNovel),
              new DropDownChoice(Job.actor, person.asActor), new DropDownChoice(Job.director, person.asDirector),
              new DropDownChoice(Job.producer, person.asProducer), new DropDownChoice(Job.composer, person.asCompositors)];
            break;
          case 'Production':
            this.listMoviesOrder = [
              new DropDownChoice(Job.producer, person.asProducer), new DropDownChoice(Job.director, person.asDirector),
              new DropDownChoice(Job.actor, person.asActor), new DropDownChoice(Job.screenwriter, person.asScreenplay),
              new DropDownChoice(Job.novelist, person.asNovel), new DropDownChoice(Job.composer, person.asCompositors)];
            break;
          default:
            console.log('default');
            this.listMoviesOrder = [
              new DropDownChoice(Job.actor, person.asActor), new DropDownChoice(Job.director, person.asDirector),
              new DropDownChoice(Job.producer, person.asProducer), new DropDownChoice(Job.screenwriter, person.asScreenplay),
              new DropDownChoice(Job.novelist, person.asNovel), new DropDownChoice(Job.composer, person.asCompositors)];
            break;
        }
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
