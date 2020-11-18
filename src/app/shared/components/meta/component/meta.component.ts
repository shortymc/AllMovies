import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { parse } from 'node-html-parser';

import { Utils } from './../../../utils';
import { MetaService } from './../service/meta.service';
import { DuckDuckGo, Search } from '../../../../constant/duck-duck-go';
import { Score } from '../../../../model/score';

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
  sites: Search[];
  @Input()
  isMovie: boolean;
  @Input()
  isSerie: boolean;
  @Output()
  sensCritique = new EventEmitter<Score>();
  links: Search[];

  constructor(
    private metaService: MetaService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this._entry
      .subscribe(x => {
        let term;
        let original;
        let itemLang;
        if (this.isMovie || this.isSerie) {
          // if serie or movie
          term = this.entry.title;
          original = this.entry.original_title;
          itemLang = this.isMovie ? this.entry.spokenLangs[0].code.toLowerCase() : this.entry.originLang.toLowerCase();
        } else {
          // if person
          term = this.entry.name;
        }
        this.links = [];
        this.sites.forEach(site => {
          this.metaService.getLinkScore(term, original, this.translate.currentLang, itemLang,
            site.site, this.entry.imdb_id, this.isMovie, this.isSerie).then(result => {
              if (!result && (this.isMovie || this.isSerie)) {
                this.metaService.getLinkScore(original, term, this.translate.currentLang, itemLang,
                  site.site, undefined, this.isMovie, this.isSerie).then(result_2 => {
                    this.handleResult(result_2, site);
                  });
              } else {
                this.handleResult(result, site);
              }
            });
        });
      });
  }

  scSeach(url: string): void {
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching url: ' + url);
        }
      })
      .then(data => {
        const link = parse(data.contents).querySelector('.erra-global');
        const title = link.getAttribute('title');
        const votes = title.slice(title.indexOf(' : ') + 2, title.indexOf(' avis')).trim();
        const score = link.rawText.replace(/(\r\n|\n|\r|\t|\n\t)/gm, '');
        this.sensCritique.emit(new Score([{ Source: 'SensCritique', Value: score }], undefined, undefined, +votes));
      });
  }

  handleResult(result: any, site: any): void {
    this.links.push({ site: result, icon: site.icon, key: site.site });
    this.links.sort((a, b) => Utils.compare(a.key, b.key, false));
    if (site.site === DuckDuckGo.SEARCH_BANG_SENSCRITIQUE.site && (this.isMovie || this.isSerie)) {
      this.scSeach(result);
    }
  }

  openAll(): void {
    this.links.slice(0, 4).forEach(link => {
      window.open(link.site);
    });
  }

}
