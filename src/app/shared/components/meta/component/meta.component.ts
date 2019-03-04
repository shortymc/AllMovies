import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';

import { Utils } from './../../../utils';
import { MetaService } from './../service/meta.service';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {
  _entry = new BehaviorSubject<any>(undefined);
  @Input()
  set entry(value: any) {
    this._entry.next(value);
  }

  get entry(): any {
    return this._entry.getValue();
  }

  @Input()
  sites: any[];
  links;

  constructor(private metaService: MetaService) { }

  ngOnInit(): void {
    this._entry
      .subscribe(x => {
        let term;
        let isMovie = false;
        if (this.entry.title) {
          // if movie
          const title = this.entry.title;
          const original = this.entry.original_title;
          term = !original || original.trim() === '' ? title : original;
          isMovie = true;
        } else {
          // if person
          term = this.entry.name;
        }
        this.links = [];
        this.sites.forEach(site => {
          this.metaService.getLinkScore(term, site.site, this.entry.imdb_id, isMovie).then(result => {
            if (!result && isMovie) {
              this.metaService.getLinkScore(this.entry.title, site.site, undefined, isMovie).then(result_2 => {
                this.handleResult(result_2, site);
              });
            } else {
              this.handleResult(result, site);
            }
          });
        });
      });
  }

  handleResult(result: any, site: any): void {
    this.links.push({ site: result, icon: site.icon, key: site.site });
    this.links.sort((a, b) => Utils.compare(a.key, b.key, false));
  }

  openAll(): void {
    this.links.slice(0, 4).forEach(link => {
      window.open(link.site);
    });
  }

}
