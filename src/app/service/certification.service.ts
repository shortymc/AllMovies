import { Utils } from './../shared/utils';
import { Url } from './../constant/url';
import { Observable } from 'rxjs/Observable';
import { Certification } from './../model/model';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class CertificationService {

  constructor(private serviceUtils: ServiceUtils, private toast: ToastService) { }

  getAllCertification(): Observable<Certification[]> {
    const url = `${Url.GET_ALL_CERTIFICATIONS_URL}${Url.API_KEY}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .map((response: any) => this.mapCertification(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  mapCertification(response: any): Certification[] {
    const result = response.certifications['FR'].map(element => {
      const certif = new Certification();
      certif.certification = element.certification;
      certif.meaning = this.formatMeaning(element.meaning);
      certif.order = element.order;
      return certif;
    });
    return result.sort((a, b) => Utils.compare(+a.order, +b.order, true));
  }

  formatMeaning(meaning: string): string {
    let result;
    return meaning.indexOf(')') !== -1 ?
      result = meaning.substr(1, meaning.indexOf(')') - 1) :
      result = meaning.substr(0, meaning.indexOf('.'));
  }
}
