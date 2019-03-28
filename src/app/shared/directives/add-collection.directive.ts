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
import { MyMoviesService } from './../service/my-movies.service';
import { MovieDetailConfig } from '../../model/model';
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
    private myMoviesService: MyMoviesService,
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
    this.subs.push(this.myMoviesService.myMovies$.subscribe((movies) => this.myMovies = movies));
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
    this.subs.push(this.myMoviesService.myMovies$.subscribe(myMovies => {
      if (myMovies && myMovies.length > 0) {
        this.isAlreadyAdded = this.movies.filter(movie => !myMovies.map(m => m.id).includes(movie.id)).length === 0;
        this.insertIconAndText(component);
      }
    }));
  }

  insertIconAndText(component: ComponentRef<FaIconComponent>): void {
    if (this.isAlreadyAdded) {
      if (this.movies.length > 1) {
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
    if (this.movies.length > 1) {
      this.movies = this.movies.filter((mov: Movie) => mov.checked);
    }
    this.addMovies();
  }

  remove(): void {
    if (this.movies.length === 1) {
      const movieRemoved = this.myMovies.find(m => m.id === this.movies[0].id);
      const tagsToReplace = this.tags.filter(t => movieRemoved.tags.includes(t.id));
      tagsToReplace.forEach(t => t.movies = t.movies.filter(movie => movieRemoved.id !== movie.id));
      this.myMoviesService.remove([movieRemoved.id])
        .then(() => this.myTagsService.replaceTags(tagsToReplace));
    }
  }

  addMovies(): void {
    const prom = [];
    this.movies.forEach(movie => {
      prom.push(this.movieService.getMovie(movie.id, new MovieDetailConfig(false, false, false, false, false, false, false, false, 'fr'), false));
      prom.push(this.movieService.getMovie(movie.id, new MovieDetailConfig(false, false, false, false, false, false, false, false, 'en'), false));
    });
    forkJoin(prom).subscribe((movies: Movie[]) => {
      this.myMoviesService.add(movies);
      this.movies.forEach((movie) => movie.checked = false);
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
