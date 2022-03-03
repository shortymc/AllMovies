import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {map, catchError} from 'rxjs/operators';

import {Url} from './../../constant/url';
import {Genre} from './../../model/model';
import {ToastService} from './toast.service';
import {UtilsService} from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  constructor(
    private serviceUtils: UtilsService,
    private toast: ToastService
  ) {}

  getAllGenre(isMovie: boolean, language: string): Observable<Genre[]> {
    const url = `${
      isMovie ? Url.GET_MOVIE_GENRES_URL : Url.GET_SERIE_GENRES_URL
    }${Url.API_KEY}${Url.LANGUE}${language}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map((response: any) =>
          response.genres.map((r: any) => <Genre>{id: r.id, name: r.name})
        ),
        catchError(err => this.serviceUtils.handlePromiseError(err, this.toast))
      );
  }
}
