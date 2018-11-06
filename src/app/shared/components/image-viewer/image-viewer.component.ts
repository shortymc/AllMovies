import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit, AfterViewChecked {
  @Input() images: string[];
  @ViewChild('galleryThumbs') swiperThumb: SwiperComponent;
  @ViewChild('galleryTop') swiperTop: SwiperComponent;
  indexThumb: number;
  indexTop: number;
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

  constructor(
    private elem: ElementRef
  ) { }

  ngOnInit() {
    this.indexThumb = 0;
    this.indexTop = 0;
    this.swiperTop.indexChange.subscribe(index => {
      this.indexThumb = index;
    });
    this.swiperThumb.indexChange.subscribe(index => {
      this.indexTop = index;
    });
    this.maxSize = this.images.length;
  }

  ngAfterViewChecked() {
    if (!this.nextBtn) {
      this.nextBtn = this.elem.nativeElement.querySelector('.gallery-top .swiper-button-next');
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          if (this.indexTop < this.maxSize) {
            this.indexTop = this.indexTop + 1;
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
            this.indexThumb = this.indexTop;
          }
        });
      }
    }
  }

}
