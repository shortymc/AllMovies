/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {SeriesResolverService} from './series-resolver.service';

describe('Service: SeriesResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeriesResolverService],
    });
  });

  it('should ...', inject(
    [SeriesResolverService],
    (service: SeriesResolverService) => {
      expect(service).toBeTruthy();
    }
  ));
});
