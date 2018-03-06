import { Url } from './../constant/url';

export class Utils {

  static getPosterPath(r: any, size: number) {
    const path = r.poster_path;
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
    return r.original_title === r.title ? '' : r.original_title;
  }
}
