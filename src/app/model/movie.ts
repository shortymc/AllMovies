import { Score } from './score';
import { Genre, Keyword, ReleaseDate, AlternativeTitle, Lang } from './model';

export class Movie {
  constructor(public id?: number, public title?: string, public original_title?: string, public date?: string,
    public synopsis?: string, public affiche?: string, public thumbnail?: string, public adult?: boolean,
    public time?: number, public note?: number, public budget?: number, public recette?: number,
    public language?: string, public videos?: string[], public actors?: string[], public crew?: string[],
    public recommendations?: Movie[], public images?: string[], public checked?: boolean, public genres?: Genre[],
    public popularity?: number, public vote_count?: number, public production_countries?: string[],
    public lang_version: string = 'fr', public added: Date = new Date(), public imdb_id?: string, public score?: Score,
    public similars?: Movie[], public keywords?: Keyword[], public images_thumb?: string[], public releaseDates?: ReleaseDate[],
    public alternativeTitles?: AlternativeTitle[], public spokenLangs?: Lang[], public character?: string) { }
}
/*
title
original_title
genres

synopsis
videos
*/
