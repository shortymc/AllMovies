import { filter } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TabsService } from './shared/service/tabs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this.tabsService.onNavigation(event);
    });
  }
}
