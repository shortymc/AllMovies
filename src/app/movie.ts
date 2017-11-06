export class Movie {
    id: number;
    title: string;
    original_title: string;
    date: string;
    synopsis: string;
    affiche: string;
    thumbnail: string;
    adult: boolean;
    time: number;
    note: number;
	budget: number;
	recette: number;
    videos: string[];
    actors: string[];
	crew: string[];
    images: string[];
    recommendations: Movie[];
    constructor(id: number, title: string, original_title: string, date: string, synopsis: string, affiche: string, thumbnail: string, 
        adult: boolean, time: number, note: number, budget: number, recette: number, videos: string[], actors: string[], crew: string[], 
        recommendations: Movie[], images: string[]) {
        this.id = id;
        this.title = title;
        this.original_title = original_title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
        this.thumbnail = thumbnail;
        this.adult = adult;
        this.time = time;
        this.note = note;
        this.videos = videos;
        this.actors = actors;
        this.crew = crew;
        this.budget = budget;
        this.recette = recette;
        this.recommendations = recommendations;
        this.images = images;
    }
}