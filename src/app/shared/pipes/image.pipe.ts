import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  static readonly ORIGINAL_IMG_SIZE = 'original';
  static readonly MEDIUM_IMG_SIZE = 'w154';
  static readonly SMALL_IMG_SIZE = 'w92';
  static readonly EMPTY_IMAGE_URL = './assets/empty_';
  static readonly MOVIE_DB_IMAGE_URL = 'https://image.tmdb.org/t/p/';
  static readonly settings = new Map()
    .set('original', ImagePipe.ORIGINAL_IMG_SIZE)
    .set('medium', ImagePipe.MEDIUM_IMG_SIZE)
    .set('small', ImagePipe.SMALL_IMG_SIZE);

  transform(path: any, size: 'original' | 'medium' | 'small', noEmpty?: boolean): string {
    const width = ImagePipe.settings.get(size);
    if (path === undefined || path === null && noEmpty) {
      return undefined;
    } else if (path === undefined || path === null) {
      return ImagePipe.EMPTY_IMAGE_URL + width + '.jpg';
    } else {
      return ImagePipe.MOVIE_DB_IMAGE_URL + width + path;
    }
  }
}
