import { Utils } from './../../utils';
import { MetaService } from './../service/meta.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, Input } from '@angular/core';
import { Url } from '../../../constant/url';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {
  _entry = new BehaviorSubject<any>(null);
  @Input()
  set entry(value) {
    this._entry.next(value);
  }

  get entry() {
    return this._entry.getValue();
  }

  @Input()
  sites: any[];
  links;
  Url = Url;

  constructor(private metaService: MetaService) { }

  ngOnInit() {
    this._entry
      .subscribe(x => {
        let term;
        let isMovie = false;
        if (this.entry.title) {
          const title = this.entry.title;
          const original = this.entry.original_title;
          term = !original || original.trim() === '' ? title : original;
          isMovie = true;
        } else {
          term = this.entry.name;
        }
        this.links = [];
        this.sites.forEach(site => {
          this.metaService.getLinkScore(term, site.site, isMovie).then(result => {
            if (!result && isMovie) {
              this.metaService.getLinkScore(this.entry.title, site.site, isMovie).then(result_2 => {
                this.handleResult(result_2, site);
              });
            } else {
              this.handleResult(result, site);
            }
          });
        });
      });
  }

  handleResult(result, site) {
    this.links.push({ site: result, icon: site.icon, key: site.site });
    this.links.sort((a, b) => Utils.compare(a.key, b.key, false));
  }

  openAll(): void {
    this.links.slice(0, 4).forEach(link => {
      window.open(link);
    });
  }

}
