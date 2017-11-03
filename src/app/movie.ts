export class Movie {
    id: number;
    title: string;
    date: string;
    synopsis: string;
    affiche: string;
    thumbnail: string;
    adult: boolean;
    time: number;
    note: number;
    videos: string[];
    actors: string[];
    recommendations: Movie[];
    constructor(id: number, title: string, date: string, synopsis: string, affiche: string, thumbnail: string, 
        adult: boolean, time: number, note: number, videos: string[], actors: string[], recommendations: Movie[]) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
        this.thumbnail = thumbnail;
        this.adult = adult;
        this.time = time;
        this.note = note;
        this.videos = videos;
        this.actors = actors;
        this.recommendations = recommendations;
    }
}