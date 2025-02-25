import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

import {Level} from './../../model/model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  open(level: Level, message: string, translateArgs?: Object): void {
    if (
      message &&
      message !== undefined &&
      typeof message === 'string' &&
      message !== ''
    ) {
      this.snackBar.open(
        this.translate.instant(message, translateArgs),
        undefined,
        {
          duration: 1500,
          panelClass: 'toast-' + level,
        }
      );
    }
  }
}
