import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Level } from './../../model/model';

@Injectable()
export class ToastService {

  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  open(message: string, level: Level, translateArgs?: Object): void {
    this.snackBar.open(this.translate.instant(message, translateArgs), undefined, {
      duration: 1500,
      panelClass: 'toast-' + level
    });
  }
}
