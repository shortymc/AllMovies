import { Utils } from '../shared/utils';

export class TagMovie {
  id: number;
  titles: Map<string, string>; // key: lang, value: title
  checked: boolean;

  static toJson(movie: TagMovie): string {
    const titles = Utils.mapToJson(<Map<any, any>>movie.titles);
    const json = JSON.stringify(movie);
    return json.replace(',"titles":{}', ',"titles":' + titles);
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
    const json = JSON.stringify(temp);
    return json.substr(0, json.length - 1) + ',"movies":[' + movies + ']}';
  }
}
