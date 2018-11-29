import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TabsService } from './shared/service/tabs.service';
import { AuthService, MyMoviesService } from './shared/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private tabsService: TabsService,
    private auth: AuthService,
    private myMoviesService: MyMoviesService,
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this.tabsService.onNavigation(event);
    });
    this.auth.isLogged.pipe(distinctUntilChanged()).subscribe(isLogged => {
      if (isLogged) {
        this.myMoviesService.getAll();
      }
    });
  }
}
