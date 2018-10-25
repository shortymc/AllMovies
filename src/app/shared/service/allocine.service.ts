import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import * as crypto from 'crypto-js';
import * as moment from 'moment-mini-ts';

@Injectable()
export class AllocineService {
  constructor(private serviceUtils: UtilsService) { }

  // Configuration
  config = {
    apiHostName: 'api.allocine.fr',
    apiBasePath: '/rest/v3/',
    // apiPartner: 'V2luZG93czg',
    apiPartner: 'YW5kcm9pZC12M3M',
    apiSecretKey: '29d185d98c984a359e6e6f26a0474269',
    imgBaseUrl: 'http://images.allocine.fr',
    userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MSAppHost/1.0)',
    proxyHostName: undefined,
    proxyPort: undefined
  };

  allocine(resource: string, code: string): Observable<any> { // AlloCiné api
    const params = { // Get params as string
      code,
      format: 'json',
      partner: 'V2luZG93czg',
      profile: 'medium',
      sed: moment().format('YYYYMMDD') // Sorted by name properties (mandatory)
    };
    console.log('params');
    console.log();

    const secretKey = 'e2b7fd293906435aa5dac4be670e7982';

    const sig = encodeURIComponent(
      crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(crypto.SHA1(secretKey).toString())));
    // crypto.SHA1(secretKey + params, 'utf-8').toString(crypto.enc.Base64).digest('base64')) // Build and hash sig param

    let response;
    const header = new HttpHeaders({ 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MSAppHost/1.0)' });
    try {
      response = this.serviceUtils.getObservable(`https://api.allocine.fr/rest/v3/${resource}?code=${params.code}&format=${params.format}&sed=${params.sed}&partner=${params.partner}&profile=${params.profile}&sig=${sig}`,
        header // Send http request with a special user-agent to bypass restriction
        //  'callback'
      );
    } catch (err) {
      console.log(err);
    }

    // Return data (return undefined if the item doesn't exist)
    return response;
  }
}
