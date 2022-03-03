import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {take, skipWhile} from 'rxjs/operators';

import {MyDatasService} from './../../../shared/shared.module';
import {Data} from './../../../model/data';

@Injectable({providedIn: 'root'})
export class DatasResolver<T extends Data> implements Resolve<T[]> {
  constructor(private myDatasService: MyDatasService<T>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<T[]> {
    if (route.data.isMovie) {
      return this.myDatasService.myMovies$.pipe(
        skipWhile(d => d.length === 0),
        take(1)
      );
    } else {
      return this.myDatasService.mySeries$.pipe(
        skipWhile(d => d.length === 0),
        take(1)
      );
    }
  }
}
