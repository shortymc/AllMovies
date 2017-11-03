import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Movie } from './movie';

@Injectable()
export class MovieService {
    private moviesUrl = 'api/movies';  // URL to web api
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
    private movieUrl = 'https://api.themoviedb.org/3/movie';
    private langue = '&language=fr';
    private append = '&append_to_response=';
    private videos = 'videos';
    private credits = 'credits';
    private recommendations = 'recommendations';
    private mostPopular = 'https://api.themoviedb.org/3/discover/movie?api_key=81c50d6514fbd578f0c796f8f6ecdafd&sort_by=popularity.desc';

    constructor(private http: Http) { }

    getMovies(): Promise<Movie[]> {
        return this.http.get(this.mostPopular)
            .toPromise()
            .then(response => this.mapMovies(response))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getMovie(id: number): Promise<Movie> {
        const url = `${this.movieUrl}/${id}?${this.api_key}${this.langue}${this.append}${this.videos},${this.credits},${this.recommendations}`;
        return this.http.get(url)
            .toPromise()
            .then(response => this.mapMovie(response))
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
        note: r.vote_average
      }));
    }
    
    recommendationsToMovies(reco: any): Movie[] {
        return reco.map((r: any) =>  <Movie>({
        id: r.id,
        title: r.title,
        date: r.release_date,
        thumbnail: "https://image.tmdb.org/t/p/w92/" + r.poster_path
      }));
        
    }
            
   mapMovie(response: Response): Movie {
        // The response of the API has a results
        // property with the actual results
        let r = response.json();
        let cast = r.credits.cast.sort(function(a1: any, a2: any) {
            if(a1.cast_id<a2.cast_id){
               return -1; 
            } else if(a1.cast_id>a2.cast_id) {
               return 1; 
            } else {
               return 0; 
            }
        });
        let poster_path = r.poster_path;
        let thumbnail = r.poster_path;
        if(poster_path === null) {
            poster_path = './app/img/empty.jpg';
            thumbnail = './app/img/empty.jpg';
        } else {
            poster_path = "https://image.tmdb.org/t/p/original/" + poster_path;
            thumbnail = "https://image.tmdb.org/t/p/w154/" + thumbnail;
        }
        let reco = r.recommendations.results.slice(0,6);
        return new Movie(r.id, r.title, r.release_date, r.overview, poster_path, thumbnail, false, r.runtime, r.vote_average, r.budget, r.revenue, 
            r.videos.results, cast.slice(0,6), this.recommendationsToMovies(reco));
    }
}