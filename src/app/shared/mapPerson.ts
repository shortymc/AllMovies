import { MapMovie } from './mapMovie';
import { Person } from './../model/person';
import { Utils } from './utils';
import { Url } from '../constant/url';

export class MapPerson {

  static mapForPerson(resp: any): Person {
    // console.log(resp);
    const credits = resp.credits;
    let img;
    if (resp.images && resp.images.profiles.length > 0) {
      img = resp.images.profiles.map((i: any) => i.file_path).filter((i: any) => i !== resp.profile_path)
        .map(path => Url.IMAGE_URL_ORIGINAL.concat(path));
    }

    const deathday = resp.deathday !== null ? resp.deathday : undefined;
    if (credits) {
      const asActor = credits.cast.map((r: any) => MapMovie.toMovie(r));
      const asDirector = credits.crew.filter((r: any) => Utils.jobEquals(r.job, 'Director')).map((r: any) => MapMovie.toMovie(r));
      const asProducer = credits.crew.filter((r: any) => Utils.jobEquals(r.job, 'Producer')).map((r: any) => MapMovie.toMovie(r));
      const asCompositors = credits.crew
        .filter((r: any) => (Utils.jobEquals(r.job, 'Compositors') || Utils.jobEquals(r.job, 'Original Music Composer')))
        .map((r: any) => MapMovie.toMovie(r));
      const asScreenplay = credits.crew.filter((r: any) => (Utils.jobEquals(r.job, 'Screenplay') || Utils.jobEquals(r.job, 'Writer')))
        .map((r: any) => MapMovie.toMovie(r));
      const asNovel = credits.crew.filter((r: any) => Utils.jobEquals(r.job, 'Novel')).map((r: any) => MapMovie.toMovie(r));

      return new Person(resp.id, resp.name, resp.gender, resp.birthday, deathday, Utils.getProfilPath(resp, Utils.ORIGINAL_IMG_SIZE),
        Utils.getProfilPath(resp, Utils.MEDIUM_IMG_SIZE), resp.biography, resp.adult, resp.place_of_birth, img,
        asActor, asDirector, asProducer, asCompositors, asScreenplay, asNovel);
    } else {
      return new Person(resp.id, resp.name, resp.gender, resp.birthday, deathday, Utils.getProfilPath(resp, Utils.ORIGINAL_IMG_SIZE),
        Utils.getProfilPath(resp, Utils.MEDIUM_IMG_SIZE), resp.biography, resp.adult, resp.place_of_birth, img,
        undefined, undefined, undefined, undefined, undefined, undefined);
    }
  }

  static mapForSearchPersons(response: any): Person[] {
    console.log(response.results);
    return response.results.slice(0, 10).map((r: any) => <Person>({
      id: r.id,
      name: r.name,
      adult: r.adult,
      thumbnail: Utils.getProfilPath(r, Utils.SMALL_IMG_SIZE, true)
    }));
  }
}
