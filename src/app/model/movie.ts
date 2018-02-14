export class Movie {
  constructor(public id: number, public title: string, public original_title: string, public date: string,
    public synopsis: string, public affiche: string, public thumbnail: string, public adult: boolean,
    public time: number, public note: number, public budget: number, public recette: number,
    public language: string, public videos: string[], public actors: string[], public crew: string[],
    public recommendations: Movie[], public images: string[], public checked: boolean, public genres: string[],
    public popularity?: number, public vote_count?:number) {
  }
}
