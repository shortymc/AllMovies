import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { Component, ViewChild, Input, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { faExpand, IconDefinition, faCompress } from '@fortawesome/free-solid-svg-icons';
import { MenuService } from '../../service/menu.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnChanges, AfterViewChecked {
  @Input() visible: boolean;
  @Input() images: string[] | string;
  @Input() thumbnails: string[] | string;
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
    pagination: {
      el: '.swiper-pagination',
      type: 'custom'
    },
    spaceBetween: 30,
    centeredSlides: true,
    zoom: false,
    slideToClickedSlide: true,
    touchEventsTarget: 'wrapper',
  };
  thumbs: SwiperConfigInterface = {
    observer: true,
    slidesPerView: 4,
    slideToClickedSlide: true,
  };
  isOnePicture: boolean;
  faExpand = faExpand;
  isFullscreen = false;
  fullScreenImg: string;
  closeBtn: IconDefinition;

  constructor(
    private menuService: MenuService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.visible = changes.visible ? changes.visible.currentValue : this.visible;
    this.images = changes.images ? changes.images.currentValue : this.images;
    this.thumbnails = changes.thumbnails ? changes.thumbnails.currentValue : this.thumbnails;
    if (this.visible) {
      this.isOnePicture = typeof this.images === 'string';
      this.indexThumb = 0;
      this.indexTop = 0;
      if (!this.isOnePicture) {
        this.closeBtn = faCompress;
      }
    }
    if (!this.isOnePicture) {
      this.menuService.visible$.next(!this.visible);
    }
  }

  ngAfterViewChecked(): void {
    if (!this.isOnePicture && this.visible !== undefined && this.visible) {
      this.swiperTop.indexChange.subscribe(index => {
        this.indexThumb = index;
      });
      this.swiperThumb.indexChange.subscribe(index => {
        this.indexTop = index;
      });
    }
  }

  next(): void {
    if (this.indexTop < this.images.length) {
      this.indexTop = this.indexTop + 1;
      this.indexThumb = this.indexTop;
    }
  }

  prev(): void {
    if (this.indexTop > 0) {
      this.indexTop = this.indexTop - 1;
      this.indexThumb = this.indexTop;
    }
  }

  fullscreen(): void {
    this.isFullscreen = true;
    this.fullScreenImg = this.isOnePicture ? <string>this.images : this.images[this.indexTop];
    this.menuService.visible$.next(this.isOnePicture && !this.isFullscreen);
  }

  closeFullscreen(event: boolean): void {
    this.isFullscreen = event;
    this.menuService.visible$.next(this.isOnePicture && !this.isFullscreen);
  }
}
