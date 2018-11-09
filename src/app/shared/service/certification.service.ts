import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { Certification } from '../../model/model';
import { Url } from '../../constant/url';
import { Utils } from '../utils';

@Injectable()
export class CertificationService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  getAllCertification(): Observable<Certification[]> {
    const url = `${Url.GET_ALL_CERTIFICATIONS_URL}${Url.API_KEY}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map((response: any) => this.mapCertification(response)),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)));
  }

  mapCertification(response: any): Certification[] {
    const result = response.certifications.FR.map(element => {
      const certif = new Certification();
      certif.certification = element.certification;
      certif.meaning = this.formatMeaning(element.meaning);
      certif.order = element.order;
      return certif;
    });
    return result.sort((a, b) => Utils.compare(+a.order, +b.order, true));
  }

  formatMeaning(meaning: string): string {
    return meaning.indexOf(')') !== -1 ?
      meaning.substr(1, meaning.indexOf(')') - 1) :
      meaning.substr(0, meaning.indexOf('.'));
  }
}
