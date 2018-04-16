import { TitleService } from './service/title.service';
import { AuthService } from './service/auth.service';
import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';

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
