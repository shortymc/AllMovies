import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { MyDatasService } from './../../../shared/shared.module';
import { Data } from './../../../model/data';

@Injectable()
export class DatasResolver<T extends Data> implements Resolve<T[]> {

  constructor(
    private myDatasService: MyDatasService<T>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T[]> {
    if (route.data.isMovie) {
      return this.myDatasService.myMovies$.pipe(take(1));
    } else {
      return this.myDatasService.mySeries$.pipe(take(1));
    }
  }
}
