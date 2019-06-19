import { Utils } from './utils';
import { List, FullList, Paginate } from '../model/model';
import { MapMovie } from './mapMovie';

export class MapList {

  static mapLists(resp: any[]): List[] {
    return resp.map(r => {
      const list = new List();
      const keys = Object.keys(r);
      keys.forEach(key => {
        r[key] === null ? list[key] = undefined : list[key] = r[key];
      });
      return list;
    }).filter((list: List) =>
      list.poster_path && list.description.trim() !== ''
    );
  }

  static mapFullList(r: any): FullList {
    console.log(r);
    const full: FullList = new FullList();
    full.id = r.id;
    full.poster_path = r.poster_path;
    full.name = r.name;
    full.revenue = r.revenue;
    full.lang = r.iso_639_1;
    full.description = r.description;
    full.country = r.iso_3166_1;
    full.average_rating = r.average_rating;
    full.runtime = r.runtime;
    full.paginate = new Paginate(r.page, MapMovie.mapForList(r.results), r.total_pages, r.total_results);
    console.log('full', full);
    return full;
  }
}
