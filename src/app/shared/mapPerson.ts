import { Job } from './../constant/job';
import { MapMovie } from './mapMovie';
import { Person } from './../model/person';
import { Utils } from './utils';

export class MapPerson {

  static mapForPerson(resp: any): Person {
    const keys = Object.keys(resp);
    keys.forEach(key => {
      if (resp[key] === null) {
        resp[key] = undefined;
      }
    });
    const credits = resp.credits;
    let img;
    if (resp.images && resp.images.profiles.length > 0) {
      img = resp.images.profiles.map((i: any) => i.file_path).filter((i: any) => i !== resp.profile_path);
    }

    let result;
    if (credits) {
      const asActor = credits.cast.map((r: any) => MapMovie.toMovie(r));
      const asDirector = credits.crew.filter((r: any) => Utils.jobEquals(r.job, Job.director)).map((r: any) => MapMovie.toMovie(r));
      const asProducer = credits.crew.filter((r: any) => Utils.jobEquals(r.job, Job.producer)).map((r: any) => MapMovie.toMovie(r));
      const asCompositors = credits.crew
        .filter((r: any) => (Utils.jobEquals(r.job, 'Compositors') || Utils.jobEquals(r.job, 'Original Music Composer')))
        .map((r: any) => MapMovie.toMovie(r));
      const asScreenplay = credits.crew.filter((r: any) => (Utils.jobEquals(r.job, 'Screenplay') || Utils.jobEquals(r.job, 'Writer')))
        .map((r: any) => MapMovie.toMovie(r));
      const asNovel = credits.crew.filter((r: any) => Utils.jobEquals(r.job, 'Novel')).map((r: any) => MapMovie.toMovie(r));
      const asOther = credits.crew.filter((r: any) =>
        !Utils.jobEquals(r.job, Job.director) && !Utils.jobEquals(r.job, 'Compositors') && !Utils.jobEquals(r.job, 'Original Music Composer') &&
        !Utils.jobEquals(r.job, 'Novel') && !Utils.jobEquals(r.job, Job.producer) && !Utils.jobEquals(r.job, 'Screenplay') &&
        !Utils.jobEquals(r.job, 'Writer')).map((r: any) => MapMovie.toMovie(r));

      result = new Person(resp.id, resp.name, resp.gender, resp.birthday, resp.deathday, resp.profile_path, resp.biography, resp.adult,
        resp.place_of_birth, img, asActor, asDirector, asProducer, asCompositors, asScreenplay, asNovel, asOther, resp.known_for_department,
        resp.popularity, resp.imdb_id);
    } else {
      result = new Person(resp.id, resp.name, resp.gender, resp.birthday, resp.deathday, resp.profile_path, resp.biography, resp.adult,
        resp.place_of_birth, img, undefined, undefined, undefined, undefined, undefined, undefined, undefined, resp.known_for_department,
        resp.popularity, resp.imdb_id);
    }
    console.log('mapPerson', result);
    return result;
  }

  static mapForSearchPersons(response: any): Person[] {
    console.log(response.results);
    return response.results.slice(0, 6).map((r: any) => <Person>({
      id: r.id,
      name: r.name,
      adult: r.adult,
      profile: r.profile_path
    }));
  }
}
