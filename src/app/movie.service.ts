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

    constructor(private http: Http) { }

    getMovies(): Promise<Movie[]> {
        return this.http.get(this.moviesUrl)
            .toPromise()
            .then(response => response.json().data as Movie[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getMovie(id: number): Promise<Movie> {
        const url = `${this.movieUrl}/${id}?${this.api_key}&${this.langue}`;
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
            
   mapMovie(response: Response): Movie {
        // The response of the API has a results
        // property with the actual results
        let r = response.json();
        return new Movie(r.id, r.original_title, r.release_date, r.overview, r.poster_path);
    }
}