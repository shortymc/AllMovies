import { Utils } from './../../utils';
import { MetaService } from './../service/meta.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, Input } from '@angular/core';
import { Url } from '../../../constant/url';
import { Movie } from '../../../model/movie';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {
  _movie = new BehaviorSubject<Movie>(null);
  @Input()
  set movie(value) {
    this._movie.next(value);
  }

  get movie() {
    return this._movie.getValue();
  }

  @Input()
  sites: any[];
  @Input()
  openBtn: boolean;
  links = [];
  Url = Url;

  constructor(private metaService: MetaService) { }

  ngOnInit() {
    this._movie
      .subscribe(x => {
        const title = this.movie.title;
        const original = this.movie.original_title;
        const searchTitle = !original || original.trim() === '' ? title : original;
        this.sites.forEach(site => {
          this.metaService.getLinkScore(searchTitle, site.site).then(result => {
            this.links.push({ site: result, icon: site.icon, key: site.site });
            this.links.sort((a, b) => Utils.compare(a.key, b.key, false));
          });
        });
      });
  }

  openAll(): void {
    if (this.openBtn) {
      this.links.slice(0, 4).forEach(link => {
        window.open(link);
      });
    }
  }

}
