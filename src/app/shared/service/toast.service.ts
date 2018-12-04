import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Level } from './../../model/model';

@Injectable()
export class ToastService {

  constructor(public snackBar: MatSnackBar) { }

  open(message: string, level: Level): void {
    this.snackBar.open(message, undefined, {
      duration: 1500,
      panelClass: 'toast-' + level
    });
  }
}
