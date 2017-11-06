import { Movie } from './movie';

export class Person {
    id: number;
	name: string;
	birthday: string;
	deathday: string;
	profile: string;
	thumbnail: string;
	biography: string;
	adult: boolean;
    moviesCast: Movie[];
    constructor(id: number, name: string, birthday: string, deathday: string, profile: string, thumbnail: string, biography: string, adult: boolean, moviesCast: Movie[]) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.deathday = deathday;
        this.profile = profile;
        this.adult = adult;
        this.thumbnail = thumbnail;
        this.biography = biography;
        this.moviesCast = moviesCast;
    }
}