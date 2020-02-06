import { Injectable } from '@angular/core';

import { Score } from './../../model/score';
import { UtilsService } from './utils.service';
import { Constants } from './../../constant/constants';
import { ToastService } from './toast.service';

@Injectable()
export class OmdbService {

  constructor(
    private serviceUtils: UtilsService,
    private toast: ToastService
  ) { }

  getScore(id: string): Promise<Score> {
    const url = `${Constants.OMDB_URL}${Constants.OMDB_ID}${id}${Constants.OMDB_API_KEY}`;
    return this.serviceUtils.getPromise(url)
      .then((response: any) => {
        if (!response.Error) {
          const score = new Score();
          score.ratings = response.Ratings.map(r => {
            if (r.Source === 'Internet Movie Database') {
              r.Source = 'IMDb';
            }
            return r;
          });
          score.ratings.push({ Source: 'Awards', Value: response.Awards });
          score.imdb_votes = parseInt(response.imdbVotes.replace(/,/g, ''), 10);
          console.log('score', score);
          return score;
        } else {
          return undefined;
        }
      })
      .catch((err) => {
        this.serviceUtils.handlePromiseError(err, this.toast);
        return undefined;
      });
  }
}
