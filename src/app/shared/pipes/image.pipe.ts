import { Pipe, PipeTransform } from '@angular/core';
import { Url } from './../../constant/url';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  static readonly ORIGINAL_IMG_SIZE = 'original';
  static readonly MEDIUM_IMG_SIZE = 'w154';
  static readonly SMALL_IMG_SIZE = 'w92';
  static readonly settings = new Map()
    .set('original', ImagePipe.ORIGINAL_IMG_SIZE)
    .set('medium', ImagePipe.MEDIUM_IMG_SIZE)
    .set('small', ImagePipe.SMALL_IMG_SIZE);

  transform(path: any, size: 'original' | 'medium' | 'small', noEmpty?: boolean): string {
    const result = (path === undefined || path === null) ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL + ImagePipe.settings.get(size) + path;
    return noEmpty && result === Url.IMAGE_URL_EMPTY ? undefined : result;
  }
}
