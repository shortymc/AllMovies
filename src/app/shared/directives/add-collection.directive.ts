import { TranslateService } from '@ngx-translate/core';
import { faBookmark, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { forkJoin } from 'rxjs';
import {
  Directive, Input, HostListener, ViewContainerRef, ComponentFactoryResolver,
  Renderer2, ElementRef, OnChanges, SimpleChange, ComponentRef, OnInit, OnDestroy
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { Tag } from './../../model/tag';
import { Data } from './../../model/data';
import { MyDatasService } from './../service/my-datas.service';
import { DetailConfig } from '../../model/model';
import { MyTagsService } from '../service/my-tags.service';
import { SerieService } from '../service/serie.service';
import { MovieService } from './../service/movie.service';

@Directive({
  selector: '[appAddCollection]'
})
export class AddCollectionDirective<T extends Data> implements OnInit, OnChanges, OnDestroy {
  @Input()
  datas: T[];
  @Input()
  label: string;
  @Input()
  isSingleData: boolean;
  @Input()
  isMovie: boolean;

  tags: Tag[];
  myDatas: T[];
  isAlreadyAdded: boolean;

  subs = [];
  faBookmark = faBookmark;
  faStar = faStar;
  faTrash = faTrash;

  @HostListener('click', ['$event']) onClick(): void {
    if (!this.isAlreadyAdded) {
      this.add();
    } else {
      this.remove();
    }
  }

  constructor(
    private movieService: MovieService,
    private serieService: SerieService,
    private myDatasService: MyDatasService<T>,
    private myTagsService: MyTagsService,
    private translate: TranslateService,
    private vcRef: ViewContainerRef,
    private el: ElementRef,
    private cfr: ComponentFactoryResolver,
    private render: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.subs.push(this.myTagsService.myTags$.subscribe((tags) => this.tags = tags));
    if (this.isSingleData && this.datas.length > 1) {
      throw new Error('Too many datas for addCollection on single data mode');
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const field of Object.keys(changes)) {
      if (field === 'datas') {
        this.datas = changes[field].currentValue;
        this.initBtnIcon();
      } else if (field === 'isMovie') {
        this.isMovie = changes[field].currentValue;
        this.initBtnIcon();
      }
    }
  }

  initBtnIcon(): void {
    const cmpFactory = this.cfr.resolveComponentFactory(FaIconComponent);
    const component = this.vcRef.createComponent(cmpFactory);
    this.subs.push(this.myDatasService.myDatas$.subscribe(myDatas => {
      this.myDatas = myDatas;
      if (myDatas && myDatas.length > 0) {
        this.isAlreadyAdded = this.datas.every(data => myDatas.map(m => m.id).includes(data.id));
      }
      this.insertIconAndText(component);
    }));
  }

  insertIconAndText(component: ComponentRef<FaIconComponent>): void {
    if (this.isAlreadyAdded) {
      if (!this.isSingleData) {
        // Datas list -> already added
        component.instance.iconProp = faStar;
        this.el.nativeElement.innerText = this.translate.instant('global.already_added');
        this.el.nativeElement.style.pointerEvents = 'none';
      } else {
        // Single data -> remove
        component.instance.iconProp = faTrash;
        this.el.nativeElement.innerText = this.translate.instant('global.delete');
        this.el.nativeElement.style.pointerEvents = 'all';
      }
    } else {
      // Add datas
      component.instance.iconProp = faBookmark;
      this.el.nativeElement.innerText = this.translate.instant(this.label);
      this.el.nativeElement.style.pointerEvents = 'all';
    }
    this.render.insertBefore(
      this.vcRef.element.nativeElement,
      component.location.nativeElement,
      this.el.nativeElement.firstChild
    );
    component.instance.ngOnChanges({});
  }

  add(): void {
    this.addDatas(!this.isSingleData ? this.datas.filter((data: T) => data.checked) : this.datas);
  }

  remove(): void {
    if (this.isSingleData) {
      const dataRemoved = this.myDatas.find(m => m.id === this.datas[0].id).id;
      if (this.isMovie) {
        const tagsToReplace = this.tags.filter(t => t.movies.map(m => m.id).includes(dataRemoved));
        tagsToReplace.forEach(t => t.movies = t.movies.filter(data => dataRemoved !== data.id));
        this.myDatasService.remove([dataRemoved], this.isMovie)
          .then(() => this.myTagsService.replaceTags(tagsToReplace));
        } else {
          this.myDatasService.remove([dataRemoved], this.isMovie);
      }
    }
  }

  addDatas(datasToAdd: T[]): void {
    const prom = [];
    datasToAdd.forEach(data => {
      const confFr = new DetailConfig(false, false, false, false, false, false, false, false, 'fr');
      const confEn = new DetailConfig(false, false, false, false, false, false, false, false, 'en');
      if (this.isMovie) {
        prom.push(this.movieService.getMovie(data.id, confFr, false));
        prom.push(this.movieService.getMovie(data.id, confEn, false));
      } else {
        prom.push(this.serieService.getSerie(data.id, confFr, false));
        prom.push(this.serieService.getSerie(data.id, confEn, false));
      }
    });
    forkJoin(prom).subscribe((datas: T[]) => {
      this.myDatasService.add(datas, this.isMovie);
      this.datas.forEach((data) => data.checked = false);
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
