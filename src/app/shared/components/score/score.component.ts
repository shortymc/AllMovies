import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Score } from './../../../model/score';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent {
  @Input()
  score: Score;

  constructor(
    public translate: TranslateService
  ) { }

}
