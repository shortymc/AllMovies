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
    return r.original_title === r.title ? '' : r.original_title;
  }
}
