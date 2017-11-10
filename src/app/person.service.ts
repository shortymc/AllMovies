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
    private original = "https://image.tmdb.org/t/p/original";
    private images = 'images';
    private recommendations = 'recommendations';
    private thumb = "https://image.tmdb.org/t/p/w154";
    private empty = './app/img/empty.jpg';

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    
    getPerson(id: number): Promise<Person> {
//        const url = `${this.personUrl}/${id}?${this.api_key}${this.langue},${this.images}`;
        const url = `${this.personUrl}/${id}?${this.api_key}${this.append}${this.images}`;
        const urlMovies = `${this.personUrl}/${id}/movie_credits?${this.api_key}${this.langue}`;
        return Observable.forkJoin(
            this.http.get(url).map((res: Response) => res.json()),
            this.http.get(urlMovies).map((res: Response) => res.json())
        ).map(responses => {
            return [].concat(...responses);
        }).map(response => this.mapPerson(response))
          .toPromise()
          .catch(this.handleError);
    }

    mapPerson(response: any[]): Person {
        let r = response[0];
        let crew = response[1].crew;

        let asActor = response[1].cast.slice(0, 6).map((r: any) => this.toMovie(r, this.thumb, this.empty, this.original));
        let asDirector = crew.filter((r: any) => this.jobEquals(r.job, 'Director')).slice(0, 6).map((r: any) => this.toMovie(r, this.thumb, this.empty, this.original));
        let asProducer = crew.filter((r: any) => this.jobEquals(r.job, 'Producer')).slice(0, 6).map((r: any) => this.toMovie(r, this.thumb, this.empty, this.original));
        let asCompositors = crew.filter((r: any) => (this.jobEquals(r.job, 'Compositors') || this.jobEquals(r.job, 'Original Music Composer'))).slice(0, 6)
        .map((r: any) => this.toMovie(r, this.thumb, this.empty, this.original));
        let asScreenplay = crew.filter((r: any) => (this.jobEquals(r.job, 'Screenplay') || this.jobEquals(r.job, 'Writer'))).slice(0, 6)
        .map((r: any) => this.toMovie(r, this.thumb, this.empty, this.original));
        let asNovel = crew.filter((r: any) => this.jobEquals(r.job, 'Novel')).slice(0, 6).map((r: any) => this.toMovie(r, this.thumb, this.empty, this.original));
        
        return new Person(r.id, r.name, r.birthday, r.deathday, r.profile_path === null ? this.empty : this.original + r.profile_path, 
            r.profile_path === null ? this.empty : this.thumb + r.profile_path, r.biography, r.adult, 
            r.images.profiles.map((i: any) => i.file_path).filter((i: any) => i != r.profile_path), asActor, asDirector, asProducer, asCompositors, asScreenplay, asNovel);
    }

    jobEquals(job: string, filter: string): boolean {
        return job.toLowerCase() === filter.toLowerCase();
    }

    toMovie(r: any, thumb: string, empty: string, original: string): any {
        return <Movie>({
            id: r.id, title: r.title, original_title: (r.original_title === r.title ? '' : r.original_title), date: r.release_date,
            synopsis: r.overview, affiche: (r.poster_path === null ? empty : original + r.poster_path),
            thumbnail: (r.poster_path === null ? empty : thumb + r.poster_path), adult: false, note: r.vote_average
        }); 
    };
}