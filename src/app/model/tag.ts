import { Utils } from '../shared/utils';
import { Movie } from './movie';

export class TagMovie {
  id: number;
  poster: string;
  titles: Map<string, string>; // key: lang, value: title
  checked: boolean;

  static toJson(movie: TagMovie): string {
    const titles = Utils.mapToJson(<Map<any, any>>movie.titles);
    const json = JSON.stringify(movie, TagMovie.removeFields);
    return json.replace('"titles":{}', '"titles":' + titles);
  }

  static fromMovie(movie: Movie[] | Movie): TagMovie {
    const tagMovie = new TagMovie();
    tagMovie.titles = new Map();
    if (Array.isArray(movie)) {
      if (!movie || movie.length !== 2 || movie[0].id !== movie[1].id) {
        console.error('Incorrect movies', movie);
        throw new Error('Incorrect movies in TagMovie#fromMovie');
      }
      tagMovie.id = movie[0].id;
      tagMovie.poster = movie[0].affiche;
      tagMovie.titles.set(movie[0].lang_version, movie[0].title);
      tagMovie.titles.set(movie[1].lang_version, movie[1].title);
    } else {
      if (!movie || !movie.translation) {
        console.error('Incorrect movie', movie);
        throw new Error('Incorrect movie in TagMovie#fromMovie');
      }
      tagMovie.id = movie.id;
      tagMovie.poster = movie.translation.get('fr').poster;
      movie.translation.forEach((value, key) => tagMovie.titles.set(key, value.name));
    }
    return tagMovie;
  }

  static removeFields(key: string, value: string): string {
    if (['checked'].includes(key)) {
      return undefined;
    }
    return value;
  }
}

export class Tag {
  id: number;
  label: string;
  color: string;
  checked: boolean;
  movies: TagMovie[];

  static clone(tag: Tag): Tag {
    const cloneTag = { ...tag };
    cloneTag.movies.forEach(m => m.titles = new Map(m.titles));
    cloneTag.movies = Array.from(tag.movies);
    return cloneTag;
  }

  static toJson(tag: Tag): string {
    const temp: any = Tag.clone(tag);
    temp.movies = temp.movies.map(m => TagMovie.toJson(m));
    const movies = temp.movies;
    temp.movies = undefined;
    const json = JSON.stringify(temp, TagMovie.removeFields);
    return json.substr(0, json.length - 1) + ',"movies":[' + movies + ']}';
  }
}
