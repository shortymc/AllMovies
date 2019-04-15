import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { Movie } from './../../../model/movie';
import { Serie } from './../../../model/serie';
import { MyDatasService } from './../../../shared/service/my-datas.service';
import { Data } from './../../../model/data';

@Injectable()
export class DatasResolver<T extends Data> implements Resolve<T[]> {

  constructor(
    private myDatasService: MyDatasService<T>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T[]> {
    console.log('route.data.isMovie', route.data.isMovie);
    if (route.data.isMovie) {
      console.log('movie');
      return this.myDatasService.myMovies$.pipe(map(x => x), filter(y => y !== undefined && y.length > 0), take(1));
    } else {
      console.log('serie');
      return this.myDatasService.mySeries$.pipe(map(x => x), filter(y => y !== undefined && y.length > 0), take(1));
    }
  }
}
