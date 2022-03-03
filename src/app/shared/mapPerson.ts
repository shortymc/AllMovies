import {Job} from './../constant/job';
import {MapSerie} from './mapSerie';
import {MapMovie} from './mapMovie';
import {Person} from './../model/person';
import {Utils} from './utils';

export class MapPerson {
  static mapForPerson(resp: any): Person {
    const keys = Object.keys(resp);
    keys.forEach(key => {
      if (resp[key] === null) {
        resp[key] = undefined;
      }
    });
    let img;
    if (resp.images && resp.images.profiles.length > 0) {
      img = resp.images.profiles
        .map((i: any) => i.file_path)
        .filter((i: any) => i !== resp.profile_path);
    }

    const credits = resp.combined_credits;
    let result;
    if (credits) {
      const asActor = credits.cast
        .filter(c => c.media_type === 'movie')
        .map((r: any) => MapMovie.toMovie(r));
      asActor.push(
        ...credits.cast
          .filter(c => c.media_type === 'tv')
          .map((r: any) => MapSerie.toSerie(r))
      );
      const asDirector = this.getCrewCredits(credits.crew, [Job.director]);
      const asProducer = this.getCrewCredits(credits.crew, Job.producer);
      const asCompositors = this.getCrewCredits(credits.crew, Job.compositor);
      const asScreenplay = this.getCrewCredits(credits.crew, Job.screenwriter);
      const asNovel = this.getCrewCredits(credits.crew, Job.novelist);
      const asOtherRaw = credits.crew.filter((r: any) => {
        if (
          !Utils.jobEquals(r.job, Job.director) &&
          !Utils.jobContains(r.job, Job.producer) &&
          !Utils.jobContains(r.job, Job.compositor) &&
          !Utils.jobContains(r.job, Job.screenwriter) &&
          !Utils.jobContains(r.job, Job.novelist)
        ) {
          console.log('job:', r.job);
          return true;
        } else {
          return false;
        }
      });
      const asOther = asOtherRaw
        .filter(c => c.media_type === 'movie')
        .map((r: any) => MapMovie.toMovie(r));
      asOther.push(
        ...asOtherRaw
          .filter(c => c.media_type === 'tv')
          .map((r: any) => MapSerie.toSerie(r))
      );

      result = new Person(
        resp.id,
        resp.name,
        resp.gender,
        resp.birthday,
        resp.deathday,
        resp.profile_path,
        resp.biography,
        resp.adult,
        resp.place_of_birth,
        img,
        asActor,
        asDirector,
        asProducer,
        asCompositors,
        asScreenplay,
        asNovel,
        asOther,
        resp.known_for_department,
        resp.popularity,
        resp.imdb_id
      );
      console.log('mapPerson', result);
    } else {
      result = new Person(
        resp.id,
        resp.name,
        resp.gender,
        resp.birthday,
        resp.deathday,
        resp.profile_path,
        resp.biography,
        resp.adult,
        resp.place_of_birth,
        img,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        resp.known_for_department,
        resp.popularity,
        resp.imdb_id
      );
    }
    return result;
  }

  private static getCrewCredits(crew: any[], jobs: string[]): any[] {
    const filteredJob = crew.filter((r: any) =>
      jobs.some(job => Utils.jobEquals(r.job, job))
    );
    const result: any[] = filteredJob
      .filter(c => c.media_type === 'movie')
      .map((r: any) => MapMovie.toMovie(r));
    result.push(
      ...filteredJob
        .filter(c => c.media_type === 'tv')
        .map((r: any) => MapSerie.toSerie(r))
    );
    return result;
  }

  static mapForSearchPersons(response: any): Person[] {
    console.log(response.results);
    return response.results.slice(0, 6).map(
      (r: any) =>
        <Person>{
          id: r.id,
          name: r.name,
          adult: r.adult,
          profile: r.profile_path,
        }
    );
  }
}
