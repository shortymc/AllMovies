import { Movie } from './../model/movie';
import { Url } from './../constant/url';

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

  static compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  static compareDate(a, b, isAsc) {
    const year1 = a.split('/')[0];
    const month1 = a.split('/')[1];
    const year2 = b.split('/')[0];
    const month2 = b.split('/')[1];
    let result;
    if (year1 < year2) {
      result = -1;
    } else if (year1 > year2) {
      result = 1;
    } else {
      if (month1 < month2) {
        result = -1;
      } else if (month1 > month2) {
        result = 1;
      }
    }
    return result * (isAsc ? 1 : -1);
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

}
