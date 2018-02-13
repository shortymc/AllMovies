import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';

@Injectable()
export class MovieService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private score: string;
  private metaUrl: string;

  constructor(private http: HttpClient) { }

  getMovies(): Promise<Movie[]> {
    return this.http.get(Url.MOST_POPULAR_URL)
      .toPromise()
      .then(response => this.mapMoviesDT(response))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getLinkScore(title: string, site: string): Promise<string> {
    let url = Url.DUCKDUCKGO_URL + site + '+';
    // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
    // '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
    url += this.encodeQueryUrl(title) + '&format=json&no_redirect=1';
    return this.http.jsonp(url, 'callback').toPromise()
      .then((data: any) => {
        let result = <string>data.Redirect;
        if (site === 'metacritic') {
          result = result.replace('/all/', '/movie/');
        } else if (site === 'scq') {
          result += '&filter=movies';
        }
        return result;
      })
      .catch(this.handleError);
  }

  encodeQueryUrl(query: string): string {
    return encodeURIComponent(query).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  getMeta(title: string): Promise<void> {
    let url =
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDEM7hrrBdfYC8ygSW85jbSOiqiB7z309s&cx=012455488159958509456:n8jpj1vlffy&q=';
    // 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
    url += title.split(' ').join('+') + 'siteSearch=metacritic.com';
    console.log(url);
    return this.http.get(url, { headers: this.headers }).toPromise()
      .then((data: any) => {
        if (data.items !== null && data.items !== undefined) {
          return data.items[0].formattedUrl;
        } else {
          return;;
        }
      }).then((metaUrl: any) => {
        this.http.get(metaUrl, { headers: this.headers })
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

  getMovie(id: number, video: boolean, credit: boolean, reco: boolean, image: boolean): Promise<Movie> {
    //        const url = `${Url.MOVIE_URl}/${id}?${Url.API_KEY}${this.langue}${Url.APPEND}${Url.APPEND_VIDEOS},
    // ${Url.APPEND_CREDITS},${Url.APPEND_RECOMMENDATIONS},${Url.APPEND_IMAGES}`;
    let url = `${Url.MOVIE_URl}/${id}?${Url.API_KEY}`;
    if (video || credit || reco || image) {
      url += `${Url.APPEND}`;
      const parametres = [];
      if (video) {
        parametres.push(`${Url.APPEND_VIDEOS}`);
      }
      if (credit) {
        parametres.push(`${Url.APPEND_CREDITS}`);
      }
      if (reco) {
        parametres.push(`${Url.APPEND_RECOMMENDATIONS}`);
      }
      if (image) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      url += parametres.join(',');
    }
    return this.http.get(url)
      .toPromise()
      .then(response => this.mapMovie(response))
      .catch(this.handleError);
  }

  getMoviesByReleaseDates(debut: string, fin: string): Promise<Movie[]> {
    const url = `${Url.DISCOVER_URL}${Url.RELEASE_DATE_GTE_URL}${debut}${Url.RELEASE_DATE_LTE_URL}${fin}${Url.RELEASE_TYPE_URL}`;
    return this.http.get(url)
      .toPromise()
      .then(response => this.mapMovies(response))
      .catch(this.handleError);
  }

  mapMovies(response: any): Movie[] {
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      thumbnail: Url.IMAGE_URL_92 + r.poster_path,
      affiche: Url.IMAGE_URL_ORIGINAL + r.poster_path,
      synopsis: r.overview,
      time: r.runtime
    }));
  }

  mapMoviesDT(response: any): Movie[] {
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: r.poster_path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_92 + r.poster_path
    }));
  }

  recommendationsToMovies(reco: any): Movie[] {
    return reco.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      thumbnail: Url.IMAGE_URL_92 + r.poster_path,
      original_title: r.original_title,
      adult: r.adult,
      time: r.runtime,
      note: r.vote_average,
      budget: r.budget,
      recette: r.revenue,
      language: r.original_language
    }));
  }

  mapMovie(r: any): Movie {
    let cast;
    let crew;
    if (r.credits !== null && r.credits !== undefined) {
      cast = r.credits.cast.sort((a1: any, a2: any) => this.sortCast(a1, a2));
      crew = r.credits.crew;
    }
    if (cast !== undefined) {
      cast = cast.slice(0, 6);
    }
    let videos;
    if (r.videos !== null && r.videos !== undefined) {
      videos = r.videos.results;
    }
    let reco;
    if (r.recommendations !== null && r.recommendations !== undefined) {
      reco = this.recommendationsToMovies(r.recommendations.results.slice(0, 6));
    }
    let img;
    if (r.images !== null && r.images !== undefined) {
      img = r.images.backdrops.map((i: any) => i.file_path);
    }
    let genres;
    if (r.genres !== null && r.genres !== undefined) {
      genres = r.genres.map(genre => genre.name);
    }
    return new Movie(r.id, r.title, r.original_title === r.title ? '' : r.original_title, r.release_date, r.overview,
      r.poster_path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_ORIGINAL + r.poster_path,
      r.poster_path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_154 + r.poster_path,
      r.adult, r.runtime, r.vote_average, r.budget, r.revenue, r.original_language,
      videos, cast, crew, reco, img, false, genres);
  }

  sortCast(a1: any, a2: any) {
    if (a1.cast_id < a2.cast_id) {
      return -1;
    } else if (a1.cast_id > a2.cast_id) {
      return 1;
    } else {
      return 0;
    }
  }
}
