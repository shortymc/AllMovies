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
  @Input()
  isMovie: boolean;
  @Input()
  isSerie: boolean;
  links;

  constructor(private metaService: MetaService) { }

  ngOnInit(): void {
    this._entry
      .subscribe(x => {
        let term;
        if (this.isMovie) {
          // if movie
          const title = this.entry.title;
          const original = this.entry.original_title;
          term = !original || original.trim() === '' ? title : original;
        } else if (this.isSerie) {
          // if serie
          const title = this.entry.title;
          const original = this.entry.originTitle;
          term = !original || original.trim() === '' ? title : original;
        } else {
          // if person
          term = this.entry.name;
        }
        this.links = [];
        this.sites.forEach(site => {
          this.metaService.getLinkScore(term, site.site, this.entry.imdb_id, this.isMovie, this.isSerie).then(result => {
            if (!result && (this.isMovie || this.isSerie)) {
              this.metaService.getLinkScore(this.entry.title, site.site, undefined, this.isMovie, this.isSerie).then(result_2 => {
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
