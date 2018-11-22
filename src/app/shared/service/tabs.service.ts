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
    if (!sessionStorage.getItem('tabs')) {
      this.storeTabs();
    } else {
      this.liens = JSON.parse(sessionStorage.getItem('tabs'));
      this.links.next(this.liens);
      this.activeLink = JSON.parse(sessionStorage.getItem('active'));
    }
  }

  storeTabs(): void {
    sessionStorage.setItem('tabs', JSON.stringify(this.liens));
    sessionStorage.setItem('active', JSON.stringify(this.activeLink));
  }

  onNavigation(event: NavigationStart): void {
    this.liens[this.liens.map(l => l.url).indexOf(this.activeLink.url)].url = event.url;
    this.links.next(this.liens);
    this.storeTabs();
  }

  openTab(link: Link, selectAfterAdding: boolean): void {
    if (!this.liens.map(l => l.url).includes(link.url)) {
      this.liens = [...this.liens, link];
      this.links.next(this.liens);
    }
    if (selectAfterAdding) {
      this.changeTab(link);
    } else {
      this.storeTabs();
    }
  }

  updateCurTabLabel(label: string): void {
    this.liens[this.liens.map(l => l.url).indexOf(this.activeLink.url)].label = label;
    this.activeLink.label = label;
  }

  closeTab(link: Link): void {
    const index = this.liens.map(l => l.url).indexOf(link.url);
    this.liens = this.liens.filter(lien => lien.url !== link.url);
    this.links.next(this.liens);
    if (this.activeLink === link) {
      this.changeTab(index === 0 ? this.liens[0] : this.liens[index - 1]);
    } else {
      this.storeTabs();
    }
  }

  changeTab(link: Link): void {
    this.activeLink = link;
    this.storeTabs();
    this.router.navigateByUrl(link.url);
  }
}
