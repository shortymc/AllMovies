import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange,
} from '@angular/core';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {MyDatasService} from '../../service/my-datas.service';
import {Data} from '../../../model/data';

@Component({
  selector: 'app-bookmarked',
  templateUrl: './bookmarked.component.html',
  styleUrls: ['./bookmarked.component.scss'],
})
export class BookmarkedComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  isMovie!: boolean;
  @Input()
  id!: number;

  subs: Subscription[] = [];
  faStar = faStar;

  constructor(
    private myDatasService: MyDatasService<Data>,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initIcon();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    for (const field of Object.keys(changes)) {
      if (field === 'id') {
        this.id = changes[field].currentValue;
      } else if (field === 'isMovie') {
        this.isMovie = changes[field].currentValue;
      }
    }
  }

  initIcon(): void {
    this.subs.push(
      this.myDatasService.mySeries$.subscribe(myDatas => {
        if (
          !this.isMovie &&
          myDatas &&
          myDatas.length > 0 &&
          myDatas.map(m => +m.id).includes(this.id)
        ) {
          this.renderer.removeClass(this.el.nativeElement, 'hidden');
        } else if (!this.isMovie) {
          this.renderer.addClass(this.el.nativeElement, 'hidden');
        }
      })
    );
    this.subs.push(
      this.myDatasService.myMovies$.subscribe(myDatas => {
        if (
          this.isMovie &&
          myDatas &&
          myDatas.length > 0 &&
          myDatas.map(m => m.id).includes(this.id)
        ) {
          this.renderer.removeClass(this.el.nativeElement, 'hidden');
        } else if (this.isMovie) {
          this.renderer.addClass(this.el.nativeElement, 'hidden');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe());
  }
}
