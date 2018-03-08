import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material';

export class MyPaginator extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();
    this.itemsPerPageLabel = this.translate.instant('movies.mat-table.itemsPerPageLabel');
  }

  // nextPageLabel = 'Slijedeća stranica';
  // previousPageLabel = 'Prethodna stranica';

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
    return startIndex + 1 + ' - ' + endIndex + this.translate.instant('movies.mat-table.of') + length;
  };

}
