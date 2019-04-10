import { filter } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Movie } from './model/movie';
import { AuthService, MyDatasService, MyTagsService, TabsService } from './shared/shared.module';
import { Serie } from './model/serie';

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
    private myMoviesService: MyDatasService<Movie>,
    private mySeriesService: MyDatasService<Serie>,
    private myTagsService: MyTagsService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this.tabsService.onNavigation(event);
    });
    this.auth.getCurrentUser(false);
    this.auth.user$.subscribe(user => {
      if (user) {
        this.myMoviesService.getAll(true);
        this.mySeriesService.getAll(false);
        this.myTagsService.getAll();
        this.translate.use(user.lang.code);
      }
    });
  }
}
