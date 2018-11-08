import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

import { TitleService, PersonService } from './../../../../shared/shared.module';
import { Movie } from '../../../../model/movie';
import { MovieService } from '../../../../shared/shared.module';
import { Person } from '../../../../model/person';
import { Url } from '../../../../constant/url';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  movies: Movie[] = [];
  persons: Person[] = [];
  Url = Url;

  constructor(
    private movieService: MovieService,
    private personService: PersonService,
    private translate: TranslateService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('');
    this.getTopMovies(this.translate.currentLang);
    this.getToPersons(this.translate.currentLang);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getTopMovies(event.lang);
      this.getToPersons(event.lang);
    });
  }

  getTopMovies(language: string): void {
    this.movieService.getPopularMovies(language)
      .then(movies => this.movies = movies.slice(0, 5));
  }

  getToPersons(language: string): void {
    this.personService.getPopularPersons(language)
      .then(persons => this.persons = persons.slice(0, 5));
  }
}
