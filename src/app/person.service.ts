import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

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

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    
    getPerson(id: number): Promise<Person> {
    	const url = `${this.personUrl}/${id}?${this.api_key}${this.langue}`;
    	return this.http.get(url)
    	.toPromise()
    	.then(response => this.mapPerson(response))
    	.catch(this.handleError);
    }
   
   mapPerson(response: Response): Person {
	   let r = response.json();
	   let profile_path = r.profile_path;
	   let thumbnail = r.profile_path;
	   if(profile_path === null) {
		   profile_path = './app/img/empty.jpg';
		   thumbnail = './app/img/empty.jpg';
	   } else {
		   profile_path = "https://image.tmdb.org/t/p/original/" + profile_path;
		   thumbnail = "https://image.tmdb.org/t/p/w154/" + thumbnail;
	   }
	   return new Person(r.id, r.name, r.birthday, r.deathday, profile_path, thumbnail, r.biography);
   }
}