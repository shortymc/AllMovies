import { AuthService } from './service/auth.service';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements AfterViewInit {

  constructor(public auth: AuthService, private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
