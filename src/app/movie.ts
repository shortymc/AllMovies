export class Movie {
	id: number;
	title: string;
    date: string;
    synopsis: string;
    affiche: string;
    adult: boolean;
    videos: string[];
    constructor(id: number, title: string, date: string, synopsis: string, affiche: string, adult: boolean, videos: string []) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
        this.adult = adult;
        this.videos = videos;
    }
}