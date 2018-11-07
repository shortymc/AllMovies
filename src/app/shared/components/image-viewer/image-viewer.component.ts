import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { faExpand, IconDefinition, faCompress } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  @Input() images: string[] | string;
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
    navigation: false,
    pagination: true,
    spaceBetween: 20,
    centeredSlides: true,
    zoom: false,
    slideToClickedSlide: true,
    touchEventsTarget: 'wrapper',
  };
  thumbs: SwiperConfigInterface = {
    observer: true,
    slidesPerView: 4,
    centeredSlides: true,
    slideToClickedSlide: true,
  };
  isOnePicture: boolean;
  faExpand = faExpand;
  isFullscreen = false;
  fullScreenImg: string;
  closeBtn: IconDefinition;

  constructor(
    private elem: ElementRef
  ) { }

  ngOnInit() {
    this.isOnePicture = typeof this.images === 'string';
    this.indexThumb = 0;
    this.indexTop = 0;
    if (!this.isOnePicture) {
      this.closeBtn = faCompress;
      this.swiperTop.indexChange.subscribe(index => {
        this.indexThumb = index;
      });
      this.swiperThumb.indexChange.subscribe(index => {
        this.indexTop = index;
      });
    }
  }

  next() {
    if (this.indexTop < this.images.length) {
      this.indexTop = this.indexTop + 1;
      this.indexThumb = this.indexTop;
    }
  }

  prev() {
    if (this.indexTop > 0) {
      this.indexTop = this.indexTop - 1;
      this.indexThumb = this.indexTop;
    }
  }

  fullscreen(img: string) {
    this.isFullscreen = true;
    this.fullScreenImg = img;
  }

}
