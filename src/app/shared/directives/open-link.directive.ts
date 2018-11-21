import { Directive, HostListener, Input } from '@angular/core';
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
  @Input() url: string;
  @Input() label: string;
  @HostListener('mouseover', ['$event']) onMouseEnter(event: MouseEvent): void {
    this.setTimeoutConst = setTimeout(() => {
      this.openDialog(event);
    }, 1000);
  }
  @HostListener('click') onClick(): void {
    this.dialogRef.close();
    this.router.navigateByUrl(this.url);
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
        position: { right: window.innerWidth - event.x - 125 + 'px', top: event.y + 'px' },
        panelClass: 'toto',
        data: { link: new Link(this.label, this.url) }
      });

      this.dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        clearTimeout(this.setTimeoutConst);
        if (result !== undefined) {
          this.tabsService.openTab(new Link(this.label, this.url), result);
        }
      });
    }
  }
}
