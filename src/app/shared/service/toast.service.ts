import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { Level } from './../../model/model';
import { Utils } from '../utils';

@Injectable()
export class ToastService {

  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  open(level: Level, message: string, translateArgs?: Object): void {
    message = (typeof message).toLowerCase() === 'object' ? Utils.stringifyJson(message) : message;
    this.snackBar.open(message !== undefined || message.trim() !== '' ? this.translate.instant(message, translateArgs) : message, undefined, {
      duration: level === Level.success ? 1500 : 2500,
      panelClass: 'toast-' + level
    });
  }
}
