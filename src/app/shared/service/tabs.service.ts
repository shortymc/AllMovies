import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Link } from './../../model/model';

@Injectable()
export class TabsService {
  private liens = [new Link('AllMovies', '/')];
  links = new BehaviorSubject(this.liens);
  isSelectAfterAdding = new BehaviorSubject(true);
  activeLink = this.liens[0];

  constructor(
    private router: Router
  ) {
    if (!localStorage.getItem('tabs')) {
      this.storeTabs();
    } else {
      this.liens = JSON.parse(localStorage.getItem('tabs'));
      this.links.next(this.liens);
      this.activeLink = JSON.parse(localStorage.getItem('active'));
    }
  }

  storeTabs(): void {
    localStorage.setItem('tabs', JSON.stringify(this.liens));
    localStorage.setItem('active', JSON.stringify(this.activeLink));
  }

  onNavigation(event: NavigationStart): void {
    this.liens[this.liens.map(l => l.url).indexOf(this.activeLink.url)].url = event.url;
    this.activeLink.url = event.url;
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
      this.isSelectAfterAdding.next(false);
    }
  }

  updateCurTabLabel(label: string): void {
    this.liens[this.liens.map(l => l.url).indexOf(this.activeLink.url)].label = label;
    this.activeLink.label = label;
    this.links.next(this.liens);
    this.storeTabs();
  }

  closeTab(closedLink: Link): void {
    const index = this.liens.map(l => l.url).indexOf(closedLink.url);
    this.liens = this.liens.filter(lien => lien.url !== closedLink.url);
    this.links.next(this.liens);
    if (this.activeLink.url === closedLink.url) {
      if (index < this.liens.length) {
        this.changeTab(this.liens[index]);
      } else {
        this.changeTab(index === 0 ? this.liens[0] : this.liens[index - 1]);
      }
    } else {
      this.storeTabs();
    }
  }

  closeAll(): void {
    this.liens = [new Link('AllMovies', '/')];
    this.activeLink = this.liens[0];
    this.links.next(this.liens);
    this.router.navigateByUrl(this.activeLink.url);
  }

  changeTab(link: Link): void {
    this.activeLink = link;
    this.storeTabs();
    this.router.navigateByUrl(link.url);
    this.isSelectAfterAdding.next(true);
  }
}
