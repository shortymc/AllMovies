import { Observable } from 'rxjs/Observable';
import { Url } from './../../../constant/url';
import { UtilsService } from './../../service/utils.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ToastService } from '../../service/toast.service';

@Injectable()
export class MetaService {
  private score: string;

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  getLinkScore(title: string, site: any, isMovie: boolean): Promise<string> {
    // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
    // '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
    if (site === Url.SEARCH_BANG_WIKI_EN.site || site === Url.SEARCH_BANG_WIKI_FR.site) {
      return this.wikisearch(title, site).toPromise();
    } else {
      let url = Url.DUCKDUCKGO_URL + site + '+';
      url += UtilsService.encodeQueryUrl(title) + '&format=json&no_redirect=1';
      return this.serviceUtils.jsonpPromise(url, 'callback')
        .then((data: any) => {
          let result = <string>data.Redirect;
          if (site === Url.SEARCH_BANG_METACRITIC.site) {
            result = isMovie ? result.replace('/all/', '/movie/') : result.replace('/all/', '/person/');
          } else if (site === Url.SEARCH_BANG_SENSCRITIQUE.site) {
            result += isMovie ? '&filter=movies' : '&filter=contacts';
          }
          return result;
        })
        .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
    }
  }

  wikisearch(term: string, site: string): Observable<any> {
    const params = new HttpParams()
      .set('action', 'opensearch')
      .set('search', term)
      .set('format', 'json');

    const url = site === Url.SEARCH_BANG_WIKI_EN.site ? `http://en.wikipedia.org/w/api.php?${params.toString()}`
      : `http://fr.wikipedia.org/w/api.php?${params.toString()}`;

    return this.serviceUtils.jsonpObservable(url, 'callback')
      .map(response => {
        return response[3][0];
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMeta(title: string): Promise<void> {
    let url =
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDEM7hrrBdfYC8ygSW85jbSOiqiB7z309s&cx=012455488159958509456:n8jpj1vlffy&q=';
    // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
    url += title.split(' ').join('+') + 'siteSearch=metacritic.com';
    console.log(url);
    return this.serviceUtils.getPromise(url, this.serviceUtils.getHeaders())
      .then((data: any) => {
        if (data.items !== null && data.items !== undefined) {
          return data.items[0].formattedUrl;
        } else {
          return;
        }
      }).then((metaUrl: any) => {
        this.serviceUtils.getObservable(metaUrl, this.serviceUtils.getHeaders())
          .map((res: any) => {
            // const htmlR = $.parseHTML(res._body);
            // this.score = $(htmlR).find('.metascore_w.larger.movie.positive')[0].innerText;
            console.log(this.score);
          });
      });
  }

  //    getMetaScore(title: string): Promise<string> {
  //        let url = 'https://api.duckduckgo.com/?q=!metacritic+';
  //        // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
  // '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
  //        console.log('url: ' + url);
  //        return this.jsonp.request(url).toPromise()
  //            .then((data: Response) => {
  //                console.log('coucou');
  //                console.log(data.json());
  //                console.log(data.json().Redirect);
  //                this.metaUrl = data.json().Redirect;
  //                return this.http.request(this.metaUrl)
  //                .subscribe(
  //                    data => {
  //                        console.log('Hello: ');
  //                        console.log(data);
  //                        data.addHeader('Access-Control-Allow-Origin','*');
  //                        let htmlR = $.parseHTML(data);
  //                        let result = $(htmlR).find($('.main_stats'));
  //                        for (let res of result) {
  //                            console.log(res);
  //                            if(res.children[0].innerText.toLowerCase() === title.toLowerCase()) {
  //                                console.log(res.children[1].innerText);
  //                                this.score = res.children[1].innerText;
  //                            }
  //                        }
  //                        return this.score;
  //                    },
  //                    err => this.handleError(err),
  //                    () => console.log('get actual visits complete')
  //                 );
  //            });
  //    }

  //    getMetaScore(title: string): Promise<string> {
  //        let url = 'https://api.duckduckgo.com/?q=!metacritic+';
  //        // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
  // '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
  //        console.log('url: ' + url);
  //        return this.jsonp.request(url).toPromise()
  //            .then((data: Response) => {
  //                console.log('coucou');
  //                console.log(data.json());
  //                console.log(data.json().Redirect);
  //                this.metaUrl = data.json().Redirect;
  //                return this.http.request(this.metaUrl)
  //                        .map((donnee: Response) => {
  //                        console.log('Hello: ');
  //                        console.log(donnee);
  //                        donnee.addHeader('Access-Control-Allow-Origin','*');
  //                        let htmlR = $.parseHTML(donnee);
  //                        let result = $(htmlR).find($('.main_stats'));
  //                        for (let res of result) {
  //                            console.log(res);
  //                            if(res.children[0].innerText.toLowerCase() === title.toLowerCase()) {
  //                                console.log(res.children[1].innerText);
  //                                return res.children[1].innerText;
  //                            }
  //                        }
  //                }).subscribe(
  //                    data => this.score = data,
  //                    err => this.handleError(err),
  //                    () => console.log('get actual visits complete')
  //                 );
  //            });
  //    }

  public getScore(): string {
    return this.score;
  }
}
