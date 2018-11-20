import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Link } from './../../model/model';

@Injectable()
export class TabsService {
  liens = [new Link('AllMovies', '/')];
  links = new BehaviorSubject(this.liens);
  activeLink = this.liens[0];

  constructor(
    private router: Router
  ) {
  }

  onNavigation(event: NavigationStart): void {
    this.liens[this.liens.indexOf(this.activeLink)].url = event.url;
    this.links.next(this.liens);
  }

  addTab(link: Link, selectAfterAdding: boolean): void {
    this.liens = [...this.liens, link];
    this.links.next(this.liens);
    if (selectAfterAdding) {
      this.changeTab(link);
    }
  }

  closeTab(link: Link): void {
    const index = this.liens.indexOf(link);
    this.liens = this.liens.filter(lien => lien === link);
    this.links.next(this.liens);
    if (this.activeLink === link) {
      this.changeTab(index === 0 ? this.liens[0] : this.liens[index - 1]);
    }
  }

  changeTab(link: Link): void {
    this.activeLink = link;
    this.router.navigateByUrl(link.url);
  }
}
