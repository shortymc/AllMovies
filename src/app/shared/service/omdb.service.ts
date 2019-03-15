import { Injectable } from '@angular/core';

import { Score } from './../../model/score';
import { UtilsService } from './utils.service';
import { Url } from '../../constant/url';

@Injectable()
export class OmdbService {

  constructor(private serviceUtils: UtilsService) { }

  getScore(id: string): Promise<Score> {
    const url = `${Url.OMDB_URL}${Url.OMDB_ID}${id}${Url.OMDB_API_KEY}`;
    return this.serviceUtils.getPromise(url)
      .then((response: any) => {
        const score = new Score();
        score.ratings = response.Ratings.map(r => {
          if (r.Source === 'Internet Movie Database') {
            r.Source = 'IMDb';
          }
          return r;
        });
        score.ratings.push({Source: 'Awards', Value: response.Awards});
        score.imdb_votes = parseInt(response.imdbVotes.replace(/,/g, ''), 10);
        console.log('score', score);
        return score;
      });
  }
}
