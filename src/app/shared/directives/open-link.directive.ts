import { Directive, ElementRef, HostListener, Input, DebugElement, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Link } from './../../model/model';
import { OpenLinkDialogComponent } from '../components/open-link-dialog/open-link-dialog.component';
import { TabsService } from '../service/tabs.service';

@Directive({
  selector: '[appOpenLink]'
})
export class OpenLinkDirective {
  dialogRef: MatDialogRef<OpenLinkDialogComponent>;
  setTimeoutConst;
  @Input('appOpenLink') link: Link;
  @HostListener('mouseover', ['$event']) onMouseEnter(event: MouseEvent): void {
    console.log('event', event);
    this.setTimeoutConst = setTimeout(() => {
      this.openDialog(event);
    }, 1000);
  }
  @HostListener('click') onClick(): void {
    this.dialogRef.close();
    this.router.navigateByUrl(this.link.url);
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private tabsService: TabsService,
  ) { }

  openDialog(event: MouseEvent): void {
    if (this.dialog.openDialogs.length === 0) {
      this.dialogRef = this.dialog.open(OpenLinkDialogComponent, {
        width: '250px',
        position: { right: window.innerWidth / 2 - 150 + event.x + 'px', top: window.innerHeight / 2 - event.y + 'px' },
        data: { link: this.link }
      });
    }

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      clearTimeout(this.setTimeoutConst);
      if (result !== undefined) {
        this.tabsService.addTab(this.link, result);
      }
    });
  }
}
