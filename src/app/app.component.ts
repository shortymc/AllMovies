import { filter } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MyTagsService } from './shared/service/my-tags.service';
import { TabsService } from './shared/service/tabs.service';
import { Movie } from './model/movie';
import { AuthService } from './shared/shared.module';
import { MyDatasService } from './shared/service/my-datas.service';

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
    private myDatasService: MyDatasService<Movie>,
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
        this.myDatasService.getAll(true);
        this.myTagsService.getAll();
        this.translate.use(user.lang.code);
      }
    });
  }
}
