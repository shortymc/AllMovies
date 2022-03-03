import {Observable, from} from 'rxjs';
import {Injectable} from '@angular/core';

import {Utils} from './../../shared/utils';
import {MockService} from './../../shared/shared.module';
import {SearchService} from './../../shared/service/search.service';
import {Network} from './../../model/model';

@Injectable({providedIn: 'root'})
export class NetworkService implements SearchService<Network> {
  networks: Network[] = [];

  constructor(private mockService: MockService<Network>) {}

  getAll(): Promise<Network[]> {
    return new Promise(resolve =>
      this.networks
        ? resolve(this.networks)
        : resolve(
            this.mockService.getAll('networks.json').then(networks => {
              this.networks = networks.sort((a, b) =>
                Utils.compare(a.name, b.name, true)
              );
              return this.networks;
            })
          )
    );
  }

  search(term: string): Observable<Network[]> {
    return from(
      this.getAll().then(networks =>
        networks
          .filter(net => net.name.toLowerCase().startsWith(term.toLowerCase()))
          .slice(0, 10)
      )
    );
  }

  byId(id: number): Observable<Network> {
    return from(
      this.getAll().then(networks => networks.find(net => net.id === id))
    );
  }
}
