import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/toPromise';

import { Movie } from './movie';
import { Person } from './person';

@Injectable()
export class PersonService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
    private personUrl = 'https://api.themoviedb.org/3/person';
    private langue = '&language=fr';
    private append = '&append_to_response=';
    private videos = 'videos';
    private credits = 'credits';
    private recommendations = 'recommendations';
    private original = "https://image.tmdb.org/t/p/original/";
    private thumb = "https://image.tmdb.org/t/p/w154/";
    private empty = './app/img/empty.jpg';

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    
//    getPerson(id: number): Promise<Person> {
//    	const url = `${this.personUrl}/${id}?${this.api_key}${this.langue}`;
//    	return this.http.get(url)
//    	.toPromise()
//    	.then(response => this.mapPerson(response))
//    	.catch(this.handleError);
//    }
    
    getPerson(id: number): Promise<Person> {
        const url = `${this.personUrl}/${id}?${this.api_key}${this.langue}`;
        const urlMovies = `${this.personUrl}/${id}/movie_credits?${this.api_key}${this.langue}`;
        return Observable.forkJoin(
            this.http.get(url).map((res: Response) => res.json()),
            this.http.get(urlMovies).map((res: Response) => res.json())
        ).map(responses => {
            return [].concat(...responses);
        }).map(response => this.mapPerson(response))
          .catch(this.handleError);
    }

    mapPerson(response: Response): Person {
        let r = response[0];
        let profile_path = r.profile_path;
        let thumbnail = r.profile_path;
        if (profile_path === null) {
            profile_path = this.empty;
            thumbnail = this.empty;
        } else {
            profile_path = this.original + profile_path;
            thumbnail = this.thumb + thumbnail;
        }

        let cast = response[1].cast.slice(0, 6);
        let moviesCast = cast.map((r: any) => <Movie>({
            id: r.id, title: r.title, original_title: (r.original_title === r.title ? '' : r.original_title), date: r.release_date,
            synopsis: r.overview, affiche: (r.poster_path === null ? this.empty : this.original + r.poster_path),
            thumbnail: (r.poster_path === null ? this.empty : this.thumb + r.poster_path), adult: false, note: r.vote_average
        }));

        return new Person(r.id, r.name, r.birthday, r.deathday, profile_path, thumbnail, r.biography, r.adult, moviesCast);
    }
}