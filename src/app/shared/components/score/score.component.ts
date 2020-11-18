import { SimpleChanges, Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Score } from './../../../model/score';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnChanges {
  @Input()
  score: Score;
  @Input()
  scScore: Score;

  constructor(
    public translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.score = changes.score ? changes.score.currentValue : this.score;
    this.scScore = changes.scScore ? changes.scScore.currentValue : this.scScore;
    if (this.scScore) {
      this.score.ratings = this.score.ratings.filter(r => <string> r.Source !== 'SensCritique');
      this.score.ratings = [...this.scScore.ratings, ...this.score.ratings];
      this.score.sc_votes = this.scScore.sc_votes;
    } else {
      this.score.ratings = [...this.score.ratings];
    }
  }

}
