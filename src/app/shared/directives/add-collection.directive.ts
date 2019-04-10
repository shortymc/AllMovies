import { TranslateService } from '@ngx-translate/core';
import { faBookmark, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { forkJoin } from 'rxjs';
import {
  Directive, Input, HostListener, ViewContainerRef, ComponentFactoryResolver,
  Renderer2, ElementRef, OnChanges, SimpleChange, ComponentRef, OnInit, OnDestroy
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { Tag } from './../../model/tag';
import { Movie } from '../../model/movie';
import { MovieService } from '../service/movie.service';
import { MyDatasService } from './../service/my-datas.service';
import { DetailConfig } from '../../model/model';
import { MyTagsService } from '../service/my-tags.service';

@Directive({
  selector: '[appAddCollection]'
})
export class AddCollectionDirective implements OnInit, OnChanges, OnDestroy {
  faBookmark = faBookmark;
  faStar = faStar;
  faTrash = faTrash;
  @Input()
  movies: Movie[];
  @Input()
  label: string;
  @Input()
  isSingleMovie: boolean;
  tags: Tag[];
  myMovies: Movie[];
  subs = [];
  isAlreadyAdded: boolean;
  @HostListener('click', ['$event']) onClick(): void {
    if (!this.isAlreadyAdded) {
      this.add();
    } else {
      this.remove();
    }
  }

  constructor(
    private movieService: MovieService,
    private myDatasService: MyDatasService<Movie>,
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
    if (this.isSingleMovie && this.movies.length > 1) {
      throw new Error('Too many movies for addCollection on single movie mode');
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const field of Object.keys(changes)) {
      if (field === 'movies') {
        this.movies = changes[field].currentValue;
        this.initBtnIcon();
      }
    }
  }

  initBtnIcon(): void {
    const cmpFactory = this.cfr.resolveComponentFactory(FaIconComponent);
    const component = this.vcRef.createComponent(cmpFactory);
    this.subs.push(this.myDatasService.myDatas$.subscribe(myMovies => {
      this.myMovies = myMovies;
      if (myMovies && myMovies.length > 0) {
        this.isAlreadyAdded = this.movies.every(movie => myMovies.map(m => m.id).includes(movie.id));
      }
      this.insertIconAndText(component);
    }));
  }

  insertIconAndText(component: ComponentRef<FaIconComponent>): void {
    if (this.isAlreadyAdded) {
      if (!this.isSingleMovie) {
        // Movies list -> already added
        component.instance.iconProp = faStar;
        this.el.nativeElement.innerText = this.translate.instant('global.already_added');
        this.el.nativeElement.style.pointerEvents = 'none';
      } else {
        // Single movie -> remove
        component.instance.iconProp = faTrash;
        this.el.nativeElement.innerText = this.translate.instant('global.delete');
        this.el.nativeElement.style.pointerEvents = 'all';
      }
    } else {
      // Add movies
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
    this.addMovies(!this.isSingleMovie ? this.movies.filter((mov: Movie) => mov.checked) : this.movies);
  }

  remove(): void {
    if (this.isSingleMovie) {
      const movieRemoved = this.myMovies.find(m => m.id === this.movies[0].id).id;
      const tagsToReplace = this.tags.filter(t => t.movies.map(m => m.id).includes(movieRemoved));
      tagsToReplace.forEach(t => t.movies = t.movies.filter(movie => movieRemoved !== movie.id));
      this.myDatasService.remove([movieRemoved], true)
        .then(() => this.myTagsService.replaceTags(tagsToReplace));
    }
  }

  addMovies(moviesToAdd: Movie[]): void {
    const prom = [];
    moviesToAdd.forEach(movie => {
      prom.push(this.movieService.getMovie(movie.id, new DetailConfig(false, false, false, false, false, false, false, false, 'fr'), false));
      prom.push(this.movieService.getMovie(movie.id, new DetailConfig(false, false, false, false, false, false, false, false, 'en'), false));
    });
    forkJoin(prom).subscribe((movies: Movie[]) => {
      this.myDatasService.add(movies, true);
      this.movies.forEach((movie) => movie.checked = false);
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
