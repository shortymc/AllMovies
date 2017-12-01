import { Injectable }    from '@angular/core';
import { Headers, Http, Response, Jsonp } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Movie } from './movie';

@Injectable()
export class MovieService {
    private moviesUrl = 'api/movies';  // URL to web api
    private headers = new Headers({ 'Content-Type': 'application/json' });
//    private headers = new Headers({ 'Content-Type': 'text/html; charset=UTF-8' }, {'Access-Control-Allow-Origin': '*'}, {'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS, HEAD'});
    private api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
    private movieUrl = 'https://api.themoviedb.org/3/movie';
    private langue = '&language=fr';
    private append = '&append_to_response=';
    private videos = 'videos';
    private credits = 'credits';
    private images = 'images';
    private recommendations = 'recommendations';
    private original = "https://image.tmdb.org/t/p/original";
    private thumb = "https://image.tmdb.org/t/p/w154";
    private small = "https://image.tmdb.org/t/p/w92";
    private empty = './app/img/empty.jpg';
    private mostPopular = 'https://api.themoviedb.org/3/discover/movie?api_key=81c50d6514fbd578f0c796f8f6ecdafd&sort_by=popularity.desc';
    private discoverUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=81c50d6514fbd578f0c796f8f6ecdafd&language=fr&region=FR';
    private release_date_gte = '&release_date.gte=';
    private release_date_lte = '&release_date.lte=';
    private release_type = '&with_release_type=2|3';
    private score: string;
    private metaUrl: string;
    
    constructor(private http: Http, private jsonp: Jsonp) { }

    getMovies(): Promise<Movie[]> {
        return this.http.get(this.mostPopular)
            .toPromise()
            .then(response => this.mapMoviesDT(response))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    
    getLinkScore(title: string, site: string): Promise<string> {
        let url = 'https://api.duckduckgo.com/?q=!' + site + '+';
        //        url += title.split(' ').join('+') + 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
//        url += title.split(' ').join('+') + '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
        url += this.encodeQueryUrl(title) + '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
        return this.jsonp.request(url).toPromise()
            .then((data: Response) => {
                let result = <string> data.json().Redirect;
                if(site === 'metacritic') {
                   result = result.replace('/all/', '/movie/');
                } else if(site === 'scq') {
                    result += '&filter=movies';
                }
                return result;
            })
            .catch(this.handleError);
    }

    encodeQueryUrl(query: string): string {
        return encodeURIComponent(query).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }

    getMeta(title: string): Promise<void> {
        let url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDEM7hrrBdfYC8ygSW85jbSOiqiB7z309s&cx=012455488159958509456:n8jpj1vlffy&q='
        //        url += title.split(' ').join('+') + 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
        url += title.split(' ').join('+') + 'siteSearch=metacritic.com';
        console.log(url);
        return this.http.get(url, { headers: this.headers }).toPromise()
            .then((data: any) => {
                console.log(data.json());
                if (data.json().items !== null && data.json().items !== undefined) {
                    return data.json().items[0].formattedUrl;
                } else {
                    return;;
                }
            }).then((metaUrl: any) => {
                this.http.get(metaUrl, { headers: this.headers })
                    .map((metaUrl: any) => {
                        let htmlR = $.parseHTML(metaUrl._body);
                        this.score = $(htmlR).find('.metascore_w.larger.movie.positive')[0].innerText;
                        console.log(this.score);
                    });
            });
    }

//    getMetaScore(title: string): Promise<string> {
//        let url = 'https://api.duckduckgo.com/?q=!metacritic+';
//        //        url += title.split(' ').join('+') + 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
//        url += title.split(' ').join('+') + '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
//        console.log("url: " + url);
//        return this.jsonp.request(url).toPromise()
//            .then((data: Response) => {
//                console.log("coucou");
//                console.log(data.json());
//                console.log(data.json().Redirect);
//                this.metaUrl = data.json().Redirect;
//                return this.http.request(this.metaUrl)
//                .subscribe(
//                    data => {
//                        console.log("Hello: ");
//                        console.log(data);
//                        data.addHeader("Access-Control-Allow-Origin","*");
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
//        //        url += title.split(' ').join('+') + 'siteSearch=http%3A%2F%2Fwww.metacritic.com%2Fmovie';
//        url += title.split(' ').join('+') + '&format=json&no_redirect=1&callback=JSONP_CALLBACK';
//        console.log("url: " + url);
//        return this.jsonp.request(url).toPromise()
//            .then((data: Response) => {
//                console.log("coucou");
//                console.log(data.json());
//                console.log(data.json().Redirect);
//                this.metaUrl = data.json().Redirect;
//                return this.http.request(this.metaUrl)
//                        .map((donnee: Response) => {
//                        console.log("Hello: ");
//                        console.log(donnee);
//                        donnee.addHeader("Access-Control-Allow-Origin","*");
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
//        const url = `${this.movieUrl}/${id}?${this.api_key}${this.langue}${this.append}${this.videos},${this.credits},${this.recommendations},${this.images}`;
        let url = `${this.movieUrl}/${id}?${this.api_key}`;
        if(video || credit || reco || image) {
            url+=`${this.append}`;
            let parametres = [];
            if(video) {
                parametres.push(`${this.videos}`);
            }
            if(credit) {
                parametres.push(`${this.credits}`); 
            }
            if(reco) {
                parametres.push(`${this.recommendations}`); 
            }
            if(image) {
                parametres.push(`${this.images}`); 
            }
            url+=parametres.join(',');
        }  
        return this.http.get(url)
            .toPromise()
            .then(response => this.mapMovie(response))
            .catch(this.handleError);
    }

    getMoviesByReleaseDates(debut: string, fin: string): Promise<Movie[]> {
        const url = `${this.discoverUrl}${this.release_date_gte}${debut}${this.release_date_lte}${fin}${this.release_type}`;
        return this.http.get(url)
            .toPromise()
            .then(response => this.mapMovies(response))
            .catch(this.handleError);
    }

    update(movie: Movie): Promise<Movie> {
        const url = `${this.moviesUrl}/${movie.id}`;
        return this.http
            .put(url, JSON.stringify(movie), { headers: this.headers })
            .toPromise()
            .then(() => movie)
            .catch(this.handleError);
    }
    create(title: string): Promise<Movie> {
        return this.http
            .post(this.moviesUrl, JSON.stringify({ title: title }), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data as Movie)
            .catch(this.handleError);
    }
    delete(id: number): Promise<void> {
        const url = `${this.moviesUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }
            
   mapMovies(response: Response): Movie[] {
        return response.json().results.map((r: any) =>  <Movie>({
        id: r.id,
        title: r.title,
        date: r.release_date,
        note: r.vote_average,
        thumbnail: this.small + r.poster_path,
        affiche: this.original + r.poster_path,
        synopsis: r.overview,
        time: r.runtime
      }));
    }
   
   mapMoviesDT(response: Response): Movie[] {
		   return response.json().results.map((r: any) =>  <Movie>({
			   id: r.id,
			   title: r.title,
			   date: r.release_date,
			   note: r.vote_average,
			   language: r.original_language,
			   thumbnail: r.poster_path === null ? this.empty : this.small + r.poster_path
		   }));
   }
    
    recommendationsToMovies(reco: any): Movie[] {
        return reco.map((r: any) =>  <Movie>({
        id: r.id,
        title: r.title,
        date: r.release_date,
        thumbnail: this.small + r.poster_path
      }));
        
    }
            
    mapMovie(response: Response): Movie {
        // The response of the API has a results
        // property with the actual results
        let r = response.json();
        let cast;
        if(r.credits !== null && r.credits !== undefined){
            cast = r.credits.cast.sort((a1: any, a2: any) => this.sortCast(a1, a2));
        }
        let videos;
        if (r.videos !== null && r.videos !== undefined) {
            videos = r.videos.results;
        }
        let reco;
        if(r.recommendations !== null && r.recommendations !== undefined) {
            reco = this.recommendationsToMovies(r.recommendations.results.slice(0, 6));
        }
        let img;
        if(r.images  !== null && r.images !== undefined) {
           img = r.images.backdrops.map((i: any) => i.file_path); 
        }
        return new Movie(r.id, r.title, r.original_title === r.title ? '' : r.original_title, r.release_date,
            r.overview, r.poster_path === null ? this.empty : this.original + r.poster_path, r.poster_path === null ? this.empty : this.thumb + r.poster_path,
            false, r.runtime, r.vote_average, r.budget, r.revenue, r.original_language,
            videos, cast.slice(0, 6), r.credits.crew, reco, img);
    }
   
   sortCast(a1: any, a2: any) {
       if(a1.cast_id<a2.cast_id){
          return -1; 
       } else if(a1.cast_id>a2.cast_id) {
          return 1; 
       } else {
          return 0; 
       }
   }
}