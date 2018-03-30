import { Score } from './../model/score';
import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Url } from '../constant/url';

@Injectable()
export class OmdbService {

  constructor(private serviceUtils: ServiceUtils) { }

  getMovie(id: string): Promise<Score> {
    const url = `${Url.OMDB_URL}${Url.OMDB_ID}${id}${Url.OMDB_API_KEY}`;
    return this.serviceUtils.getPromise(url)
      .then((response: any) => {
        const score = new Score();
        score.awards = response.Awards;
        score.ratings = response.Ratings;
        score.imdb_votes = response.imdbVotes;
        console.log('score', score);
        return score;
      });
  }
}
