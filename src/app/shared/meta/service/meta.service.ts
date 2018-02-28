import { Url } from './../../../constant/url';
import { ServiceUtils } from './../../../service/serviceUtils';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MetaService {
  private score: string;
  private metaUrl: string;

  constructor(private utils: ServiceUtils) { }

  getLinkScore(title: string, site: string): Promise<string> {
    let url = Url.DUCKDUCKGO_URL + site + '+';
    // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
    // '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
    url += this.utils.encodeQueryUrl(title) + '&format=json&no_redirect=1';
    return this.utils.http.jsonp(url, 'callback').toPromise()
      .then((data: any) => {
        let result = <string>data.Redirect;
        if (site === 'metacritic') {
          result = result.replace('/all/', '/movie/');
        } else if (site === 'scq') {
          result += '&filter=movies';
        }
        return result;
      })
      .catch(this.utils.handleError);
  }

  getMeta(title: string): Promise<void> {
    let url =
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDEM7hrrBdfYC8ygSW85jbSOiqiB7z309s&cx=012455488159958509456:n8jpj1vlffy&q=';
    // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
    url += title.split(' ').join('+') + 'siteSearch=metacritic.com';
    console.log(url);
    return this.utils.http.get(url, { headers: this.utils.headers }).toPromise()
      .then((data: any) => {
        if (data.items !== null && data.items !== undefined) {
          return data.items[0].formattedUrl;
        } else {
          return;
        }
      }).then((metaUrl: any) => {
        this.utils.http.get(metaUrl, { headers: this.utils.headers })
          .map((res: any) => {
            const htmlR = $.parseHTML(res._body);
            this.score = $(htmlR).find('.metascore_w.larger.movie.positive')[0].innerText;
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
