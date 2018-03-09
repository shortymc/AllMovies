import { Movie } from './../model/movie';
import { Url } from './../constant/url';
import { Person } from '../model/person';

export class Utils {

  static getPosterPath(r: any, size: number) {
    return Utils.getPath(r.poster_path, size);
  }

  static getProfilPath(r: any, size: number) {
    return Utils.getPath(r.profile_path, size);
  }

  static getPath(path: string, size: number) {
    switch (size) {
      case 0:
        return path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_ORIGINAL + path;
      case 154:
        return path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_154 + path;
      case 92:
        return path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_92 + path;
    }
  }

  static getTitle(r: any) {
    return r.original_title === r.title ? ' ' : r.original_title;
  }

  static recommendationsToMovies(reco: any): Movie[] {
    return reco.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      thumbnail: Utils.getPosterPath(r, 92),
      original_title: Utils.getTitle(r),
      adult: r.adult,
      time: r.runtime,
      note: r.vote_average,
      budget: r.budget,
      recette: r.revenue,
      language: r.original_language
    }));
  }

  static jobEquals(job: string, filter: string): boolean {
    return job.toLowerCase() === filter.toLowerCase();
  }

  static sortCast(a1: any, a2: any) {
    if (a1.cast_id < a2.cast_id) {
      return -1;
    } else if (a1.cast_id > a2.cast_id) {
      return 1;
    } else {
      return 0;
    }
  }

  static compareMovie(a: Movie, b: Movie): number {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  }

  static filter<T>(list: T[], searchString: string): T[] {
    if (!list || list == null || list.length === 0) {
      return [];
    }
    if (searchString == null || searchString.length === 0 || searchString.trim() === '') {
      return list;
    }

    return list.filter(Utils.compareWithAllFields, searchString);
  }

  static compareWithAllFields(value, index) {
    const fields = Object.keys(value);
    for (let i = 0; i < fields.length; i++) {
      if (value[fields[i]] != null) {
        if (true) {  // isObject(value[fields[i]])
          const childFields = Object.keys(value[fields[i]]);

          if (childFields.length > 0) {
            for (let j = 0; j < childFields.length; j++) {
              if ((value[fields[i]][childFields[j]] + '').toLowerCase().indexOf(this.toString().toLowerCase()) !== -1) {
                return true;
              }
            }
          }
        }
        if ((value[fields[i]] + '').toLowerCase().indexOf(this.toString().toLowerCase()) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  // MAPS //
  // MOVIE //
  static mapForMoviesByReleaseDates(response: any): Movie[] {
    console.log(response.results);
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Utils.getPosterPath(r, 92),
      affiche: Utils.getPosterPath(r, 0),
      synopsis: r.overview,
      time: r.runtime,
      popularity: r.popularity,
      vote_count: r.vote_count
    }));
  }

  static mapForPopularMovies(response: any): Movie[] {
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Utils.getPosterPath(r, 92)
    }));
  }

  static mapForSearchMovies(response: any): Movie[] {
    // console.log(response.results);
    return response.results.slice(0, 5).map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      adult: r.adult,
      original_title: Utils.getTitle(r),
      thumbnail: Utils.getPosterPath(r, 0)
    }));
  }

  static mapForMovie(r: any): Movie {
    console.log(r);
    const movie = new Movie();
    let cast;
    if (r.credits) {
      cast = r.credits.cast.sort((a1: any, a2: any) => Utils.sortCast(a1, a2));
      movie.crew = r.credits.crew;
    }
    if (cast) {
      movie.actors = cast;
    }
    if (r.videos) {
      movie.videos = r.videos.results;
    }
    if (r.recommendations) {
      movie.recommendations = Utils.recommendationsToMovies(r.recommendations.results);
    }
    if (r.images) {
      movie.images = r.images.backdrops.map((i: any) => i.file_path);
    }
    if (r.genres) {
      movie.genres = r.genres.map(genre => genre.name);
    }
    movie.id = r.id;
    movie.title = r.title;
    movie.original_title = Utils.getTitle(r);
    movie.date = r.release_date;
    movie.synopsis = r.overview;
    movie.affiche = Utils.getPosterPath(r, 0);
    movie.thumbnail = Utils.getPosterPath(r, 154);
    movie.adult = r.adult;
    movie.time = r.runtime;
    movie.note = r.vote_average;
    movie.budget = r.budget;
    movie.recette = r.revenue;
    movie.language = r.original_language;
    movie.checked = false;
    movie.production_countries = r.production_countries;
    return movie;
  }

  static toMovie(r: any): Movie {
    return <Movie>({
      id: r.id, title: r.title, original_title: Utils.getTitle(r), date: r.release_date, synopsis: r.overview,
      affiche: Utils.getPosterPath(r, 0), thumbnail: Utils.getPosterPath(r, 154), adult: false, note: r.vote_average
    });
  }

  // PERSON //
  static mapForPerson(response: any[]): Person {
    console.log(response);
    const resp = response[0];
    const crew = response[1].crew;

    const asActor = response[1].cast.map((r: any) => Utils.toMovie(r));
    const asDirector = crew.filter((r: any) => Utils.jobEquals(r.job, 'Director')).map((r: any) => Utils.toMovie(r));
    const asProducer = crew.filter((r: any) => Utils.jobEquals(r.job, 'Producer')).map((r: any) => Utils.toMovie(r));
    const asCompositors = crew
      .filter((r: any) => (Utils.jobEquals(r.job, 'Compositors') || Utils.jobEquals(r.job, 'Original Music Composer')))
      .map((r: any) => Utils.toMovie(r));
    const asScreenplay = crew.filter((r: any) => (Utils.jobEquals(r.job, 'Screenplay') || Utils.jobEquals(r.job, 'Writer')))
      .map((r: any) => Utils.toMovie(r));
    const asNovel = crew.filter((r: any) => Utils.jobEquals(r.job, 'Novel')).map((r: any) => Utils.toMovie(r));

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
