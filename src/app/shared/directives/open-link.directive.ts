import { TranslateService } from '@ngx-translate/core';
import { Directive, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Link } from './../../model/model';
import { OpenLinkDialogComponent } from '../components/open-link-dialog/open-link-dialog.component';
import { TabsService } from '../service/tabs.service';

@Directive({
  selector: '[appOpenLink]'
})
export class OpenLinkDirective {
  dialogRef: MatDialogRef<OpenLinkDialogComponent>;
  setTimeoutConst;
  @Input() url: string;
  @Input() label: string;
  @HostListener('mouseover', ['$event']) onMouseEnter(event: MouseEvent): void {
    this.setTimeoutConst = setTimeout(() => {
      this.openDialog(event);
    }, 1250);
  }
  @HostListener('mouseout') onMouseOut(): void {
    clearTimeout(this.setTimeoutConst);
  }
  @HostListener('click') onClick(): void {
    clearTimeout(this.setTimeoutConst);
    if (this.dialogRef !== undefined) {
      this.dialogRef.close();
    }
    this.tabsService.updateCurTabLabel(this.translate.instant(this.label));
    this.router.navigateByUrl(this.url);
  }

  constructor(
    private elementRef: ElementRef,
    private render: Renderer2,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService,
    private tabsService: TabsService,
  ) {
    this.render.addClass(this.elementRef.nativeElement, 'disable_selection');
  }

  openDialog(event: MouseEvent): void {
    // only one dialog can be open at a time
    if (this.dialog.openDialogs.length === 0) {
      // if dialog is open too low
      let y = event.y;
      if (y + 200 > window.innerHeight) {
        y = y - 200;
      }
      this.dialogRef = this.dialog.open(OpenLinkDialogComponent, {
        width: '220px',
        position: { right: window.innerWidth - event.x - 125 + 'px', top: y + 'px' },
        data: { link: new Link(this.translate.instant(this.label), this.url) }
      });

      this.dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        clearTimeout(this.setTimeoutConst);
        if (result !== undefined) {
          this.tabsService.openTab(new Link(this.translate.instant(this.label), this.url), result);
        }
      });
    }
  }
}
