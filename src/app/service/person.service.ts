import { Utils } from './../shared/utils';
import { ServiceUtils } from './serviceUtils';
import { Url } from './../constant/url';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../model/movie';
import { Person } from '../model/person';

@Injectable()
export class PersonService {

  constructor(private serviceUtils: ServiceUtils) { }

  getPerson(id: number, language: string): Promise<Person> {
    //        const url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}${Url.LANGUE_FR},${Url.APPEND_IMAGES}`;
    const url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}${Url.LANGUE}${language}${Url.APPEND}${Url.APPEND_IMAGES}`;
    const urlMovies = `${Url.PERSON_URL}/${id}/${Url.MOVIE_CREDITS_URL}?${Url.API_KEY}${Url.LANGUE}${language}`;
    return Observable.forkJoin(
      this.serviceUtils.http.get(url),
      this.serviceUtils.http.get(urlMovies)
    ).map(responses => {
      return [].concat(...responses);
    }).map(response => this.mapPerson(response))
      .toPromise()
      .catch(this.serviceUtils.handleError);
  }

  mapPerson(response: any[]): Person {
    console.log(response);
    const resp = response[0];
    const crew = response[1].crew;

    const asActor = response[1].cast.map((r: any) => this.toMovie(r));
    const asDirector = crew.filter((r: any) => this.jobEquals(r.job, 'Director')).map((r: any) => this.toMovie(r));
    const asProducer = crew.filter((r: any) => this.jobEquals(r.job, 'Producer')).map((r: any) => this.toMovie(r));
    const asCompositors = crew
      .filter((r: any) => (this.jobEquals(r.job, 'Compositors') || this.jobEquals(r.job, 'Original Music Composer')))
      .map((r: any) => this.toMovie(r));
    const asScreenplay = crew.filter((r: any) => (this.jobEquals(r.job, 'Screenplay') || this.jobEquals(r.job, 'Writer')))
      .map((r: any) => this.toMovie(r));
    const asNovel = crew.filter((r: any) => this.jobEquals(r.job, 'Novel')).map((r: any) => this.toMovie(r));

    return new Person(resp.id, resp.name, resp.gender, resp.birthday, resp.deathday, Utils.getProfilPath(resp, 0),
      Utils.getProfilPath(resp, 154), resp.biography, resp.adult, resp.place_of_birth,
      resp.images.profiles.map((i: any) => i.file_path).filter((i: any) => i !== resp.profile_path),
      asActor, asDirector, asProducer, asCompositors, asScreenplay, asNovel);
  }

  jobEquals(job: string, filter: string): boolean {
    return job.toLowerCase() === filter.toLowerCase();
  }

  toMovie(r: any): any {
    return <Movie>({
      id: r.id, title: r.title, original_title: Utils.getTitle(r), date: r.release_date, synopsis: r.overview,
      affiche: Utils.getPosterPath(r, 0), thumbnail: Utils.getPosterPath(r, 154), adult: false, note: r.vote_average
    });
  }
}
