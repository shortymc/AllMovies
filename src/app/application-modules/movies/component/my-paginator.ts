import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material';
import { DecimalPipe } from '@angular/common';

export class MyPaginator extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe(() => {
      this.initTranslation();
    });
    this.initTranslation();
  }

  initTranslation() {
    this.itemsPerPageLabel = this.translate.instant('movies.mat-table.itemsPerPageLabel');
    this.nextPageLabel = this.translate.instant('movies.mat-table.nextPageLabel');
    this.previousPageLabel = this.translate.instant('movies.mat-table.previousPageLabel');
    this.lastPageLabel = this.translate.instant('movies.mat-table.lastPageLabel');
    this.firstPageLabel = this.translate.instant('movies.mat-table.firstPageLabel');
  }

  getRangeLabel = function(page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('movies.mat-table.no_result');
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    const decimalPipe = new DecimalPipe(this.translate.currentLang);
    return startIndex + 1 + ' - ' + endIndex + this.translate.instant('movies.mat-table.of') +
      decimalPipe.transform(length, '1.0', this.translate.currentLang);
  };

}
