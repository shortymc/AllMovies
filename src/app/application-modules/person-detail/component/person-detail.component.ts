import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PersonDetailComponent implements OnInit, OnDestroy {
  person: Person;
  isImagesVisible = false;
  scrollTo: HTMLElement;
  listMoviesOrder: DropDownChoice[];

  subs = [];
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
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getPerson(this.person.id, event.lang);
    }));
  }

  getPerson(id: number, language: string): void {
    this.personService.getPerson(id, language, true)
      .then(person => {
        this.person = person;
        const actor = new DropDownChoice(Job.actor, this.groupByType(person.asActor));
        const director = new DropDownChoice(Job.director, this.groupByType(person.asDirector));
        const producer = new DropDownChoice(Job.producer, this.groupByType(person.asProducer));
        const screenplay = new DropDownChoice(Job.screenwriter, this.groupByType(person.asScreenplay));
        const compositor = new DropDownChoice(Job.composer, this.groupByType(person.asCompositors));
        const novel = new DropDownChoice(Job.novelist, this.groupByType(person.asNovel));
        const other = new DropDownChoice(Job.other, this.groupByType(person.asOther));
        switch (person.knownFor) {
          case 'Acting':
            const clonedActor = { ...actor };
            clonedActor.value.set('show', ['both']);
            this.listMoviesOrder = [clonedActor, director, producer, screenplay, novel, compositor, other];
            break;
          case 'Directing':
            const clonedDirector = { ...director };
            clonedDirector.value.set('show', ['both']);
            this.listMoviesOrder = [clonedDirector, producer, actor, screenplay, novel, compositor, other];
            break;
          case 'Sound':
            const clonedCompositor = { ...compositor };
            clonedCompositor.value.set('show', ['both']);
            this.listMoviesOrder = [clonedCompositor, actor, director, producer, screenplay, novel, other];
            break;
          case 'Writing':
            const clonedScreenplay = { ...screenplay };
            clonedScreenplay.value.set('show', ['both']);
            this.listMoviesOrder = [clonedScreenplay, novel, director, producer, compositor, other];
            break;
          case 'Production':
            const clonedProducer = { ...producer };
            clonedProducer.value.set('show', ['both']);
            this.listMoviesOrder = [clonedProducer, director, actor, screenplay, novel, compositor, other];
            break;
          default:
            console.log('default');
            this.listMoviesOrder = [clonedActor, director, producer, screenplay, novel, compositor, other];
            break;
        }
        console.log('listMoviesOrder', this.listMoviesOrder);
        this.title.setTitle(person.name);
      });
  }

  groupByType(credits: any[]): Map<string, any[]> {
    const result = new Map<string, any[]>();
    result.set('serie', []);
    result.set('movie', []);
    result.set('show', ['movie']);
    credits.forEach(c => {
      if (c.isMovie) {
        result.get('movie').push(c);
      } else {
        result.get('serie').push(c);
      }
    });
    if (result.get('movie').length === 0 && result.get('serie').length > 0) {
      result.set('show', ['serie']);
    } else {
      result.set('show', ['none']);
    }
    return result;
  }

  discover(): void {
    this.router.navigate(['discover'], { queryParams: { people: JSON.stringify([this.person.id]) } });
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
