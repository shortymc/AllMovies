import { MapMovie } from './mapMovie';
import { Person } from './../model/person';
import { Utils } from './utils';

export class MapPerson {

  static mapForPerson(response: any[]): Person {
    console.log(response);
    const resp = response[0];
    const crew = response[1].crew;

    const asActor = response[1].cast.map((r: any) => MapMovie.toMovie(r));
    const asDirector = crew.filter((r: any) => Utils.jobEquals(r.job, 'Director')).map((r: any) => MapMovie.toMovie(r));
    const asProducer = crew.filter((r: any) => Utils.jobEquals(r.job, 'Producer')).map((r: any) => MapMovie.toMovie(r));
    const asCompositors = crew
      .filter((r: any) => (Utils.jobEquals(r.job, 'Compositors') || Utils.jobEquals(r.job, 'Original Music Composer')))
      .map((r: any) => MapMovie.toMovie(r));
    const asScreenplay = crew.filter((r: any) => (Utils.jobEquals(r.job, 'Screenplay') || Utils.jobEquals(r.job, 'Writer')))
      .map((r: any) => MapMovie.toMovie(r));
    const asNovel = crew.filter((r: any) => Utils.jobEquals(r.job, 'Novel')).map((r: any) => MapMovie.toMovie(r));

    return new Person(resp.id, resp.name, resp.gender, resp.birthday, resp.deathday, Utils.getProfilPath(resp, 0),
      Utils.getProfilPath(resp, 154), resp.biography, resp.adult, resp.place_of_birth,
      resp.images.profiles.map((i: any) => i.file_path).filter((i: any) => i !== resp.profile_path),
      asActor, asDirector, asProducer, asCompositors, asScreenplay, asNovel);
  }

  static mapForSearchPersons(response: any): Person[] {
    console.log(response.results);
    return response.results.slice(0, 10).map((r: any) => <Person>({
      id: r.id,
      name: r.name,
      adult: r.adult,
      thumbnail: Utils.getProfilPath(r, 92)
    }));
  }
}
