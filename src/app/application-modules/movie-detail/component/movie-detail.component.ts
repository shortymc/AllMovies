import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { faChevronCircleLeft, faSave, faImage } from '@fortawesome/free-solid-svg-icons';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';

import { TitleService } from './../../../shared/shared.module';
// import { AllocineService } from './../../../service/allocine.service';
import { DuckDuckGo } from './../../../constant/duck-duck-go';
import { MovieService } from '../../../shared/shared.module';
import { Movie } from '../../../model/movie';

@Component({
  selector: 'app-movie-detail',
  styleUrls: ['./movie-detail.component.scss'],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit, AfterViewChecked {
  @ViewChild('galleryThumbs') swiperThumb: SwiperComponent;
  @ViewChild('galleryTop') swiperTop: SwiperComponent;
  indexThumb = 0;
  indexTop = 0;
  nextBtn: HTMLButtonElement;
  prevBtn: HTMLButtonElement;
  config: SwiperConfigInterface = {
    observer: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    pagination: false,
    spaceBetween: 20,
    centeredSlides: true,
    zoom: false,
    allowTouchMove: false,
    allowSlidePrev: true,
    allowSlideNext: true
  };
  thumbs: SwiperConfigInterface = {
    observer: true,
    slidesPerView: 4,
    centeredSlides: true,
    slideToClickedSlide: true,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  };
  maxSize: number;
  movie$: Observable<Movie>;
  isImagesVisible = false;
  Url = DuckDuckGo;
  id: number;
  faChevronCircleLeft = faChevronCircleLeft;
  faSave = faSave;
  faImage = faImage;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    private title: TitleService,
    private router: Router,
    private elem: ElementRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.movie$ = this.getMovie(this.id, this.translate.currentLang);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.movie$ = this.getMovie(this.id, event.lang);
    });
    this.movie$.subscribe((movie: Movie) => {
      this.title.setTitle(movie.title);
      this.maxSize = movie.images.length;
    });
    // this.allocine.allocine('movie', '143067').subscribe(response => console.log(response));
  }

  openImage() {
    this.swiperTop.index = 0;
    this.swiperThumb.index = 0;
    this.isImagesVisible = !this.isImagesVisible;
    this.swiperTop.indexChange.subscribe(index => {
      this.swiperTop.index = index;
      this.indexThumb = index;
    });
    this.swiperThumb.indexChange.subscribe(index => {
      this.swiperThumb.index = index;
      this.indexTop = index;
    });
  }

  ngAfterViewChecked() {
    if (!this.nextBtn) {
      this.nextBtn = this.elem.nativeElement.querySelector('.gallery-top .swiper-button-next');
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          if (this.indexTop < this.maxSize) {
            this.indexTop = this.indexTop + 1;
            this.swiperTop.index = this.indexTop;
            this.indexThumb = this.indexTop;
          }
        });
      }
    }
    if (!this.prevBtn) {
      this.prevBtn = this.elem.nativeElement.querySelector('.gallery-top .swiper-button-prev');
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          if (this.indexTop > 0) {
            this.indexTop = this.indexTop - 1;
            this.swiperTop.index = this.indexTop;
            this.indexThumb = this.indexTop;
          }
        });
      }
    }
  }

  getMovie(id: number, language: string): Observable<Movie> {
    return this.movieService.getMovie(id, true, true, true, true, language);
  }

  goBack(): void {
    const back = this.location.back();
    if (back === undefined) {
      this.router.navigate(['/']);
    }
  }
}
