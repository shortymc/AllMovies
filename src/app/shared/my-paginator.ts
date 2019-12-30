import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DecimalPipe } from '@angular/common';

export class MyPaginator extends MatPaginatorIntl {
  constructor(private translate: TranslateService, private prefix: string) {
    super();
    this.translate.onLangChange.subscribe(() => {
      this.initTranslation();
    });
    this.initTranslation();
  }

  initTranslation(): void {
    this.itemsPerPageLabel = this.translate.instant(this.prefix + '.mat-table.itemsPerPageLabel');
    this.nextPageLabel = this.translate.instant('global.mat-table.nextPageLabel');
    this.previousPageLabel = this.translate.instant('global.mat-table.previousPageLabel');
    this.lastPageLabel = this.translate.instant('global.mat-table.lastPageLabel');
    this.firstPageLabel = this.translate.instant('global.mat-table.firstPageLabel');
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('global.mat-table.no_result');
    }
    const size = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < size ?
      Math.min(startIndex + pageSize, size) :
      startIndex + pageSize;
    const decimalPipe = new DecimalPipe(this.translate.currentLang);
    return startIndex + 1 + ' - ' + endIndex + this.translate.instant('global.mat-table.of') +
      decimalPipe.transform(size, '1.0', this.translate.currentLang);
  }

}
