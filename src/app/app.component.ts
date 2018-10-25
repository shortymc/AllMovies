import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';

import { TitleService, AuthService } from './shared/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    public auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.title.setTitle('');
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
