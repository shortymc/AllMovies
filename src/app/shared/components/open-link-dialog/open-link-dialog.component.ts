import { Component, OnInit, Inject, HostListener, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-open-link-dialog',
  templateUrl: './open-link-dialog.component.html',
  styleUrls: ['./open-link-dialog.component.scss']
})
export class OpenLinkDialogComponent implements OnInit {
  @HostListener('document:click', ['$event']) onMouseOut(event: any): void {
    let result = false;
    let clickedComponent = event.target;
    do {
      if (clickedComponent === this.elemRef.nativeElement) {
        result = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!result && this.dialogRef.componentInstance) {
      this.dialogRef.close();
    }
  }

  constructor(
    private elemRef: ElementRef,
    public dialogRef: MatDialogRef<OpenLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
