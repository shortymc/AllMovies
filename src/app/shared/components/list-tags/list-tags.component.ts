import {faSave} from '@fortawesome/free-regular-svg-icons';
import {faTimes, faPen} from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  OnChanges,
  Input,
  SimpleChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {Data} from './../../../model/data';
import {Tag, TagData} from './../../../model/tag';
import {MyDatasService} from '../../service/my-datas.service';
import {Level} from './../../../model/model';
import {ToastService} from '../../service/toast.service';
import {MyTagsService} from '../../service/my-tags.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-list-tags',
  templateUrl: './list-tags.component.html',
  styleUrls: ['./list-tags.component.scss'],
})
export class ListTagsComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  tags: Tag[] = [];
  @Input()
  dataId!: number;
  @Input()
  isMovie!: boolean;
  isBtnSaveDisabled = true;
  allSeries: Data[] = [];
  allMovies: Data[] = [];
  tagsDisplayed: Tag[] = [];
  tagsToSave: Tag[] = [];
  editing = false;
  subs: Subscription[] = [];

  faRemove = faTimes;
  faEdit = faPen;
  faSave = faSave;

  constructor(
    private myDatasService: MyDatasService<Data>,
    private myTagsService: MyTagsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.myDatasService.myMovies$.subscribe(movies => {
        if (movies) {
          this.allMovies = movies;
        }
      })
    );
    this.subs.push(
      this.myDatasService.mySeries$.subscribe(series => {
        if (series) {
          this.allSeries = series;
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataId) {
      this.dataId = changes.dataId.currentValue;
      this.editing = false;
      this.tags = changes.tags
        ? changes.tags.currentValue.map((tag: Tag) => Tag.clone(<Tag>tag))
        : this.tags;
      this.tagsDisplayed = this.getTags();
      this.tagsToSave = this.getTags();
    }
  }

  getTags(): Tag[] {
    return this.tags.map(tag => Tag.clone(tag));
  }

  add(tag: Tag): void {
    if (this.tagsDisplayed.map(t => t.id).includes(tag.id)) {
      this.toast.open(Level.warning, 'toast.already_added');
    } else {
      const data = (this.isMovie ? this.allMovies : this.allSeries).find(
        m => m.id === this.dataId
      );
      tag.datas.push(TagData.fromData(data, this.isMovie));
      this.tagsDisplayed.push(tag);
      this.tagsToSave.push(tag);
      this.isTagsChanged();
    }
  }

  remove(tag: Tag): void {
    const tagToRemove = this.tagsToSave.find(t => t.id === tag.id);
    if (tagToRemove) {
      tagToRemove.datas = tag.datas.filter(
        d => d.id !== this.dataId || d.movie !== this.isMovie
      );
    }
    this.tagsDisplayed = this.tagsDisplayed.filter(t => t.id !== tag.id);
    this.isTagsChanged();
  }

  save(): void {
    this.editing = false;
    this.myTagsService.replaceTags(this.tagsToSave);
  }

  cancel(): void {
    this.editing = false;
    this.tagsDisplayed = this.getTags();
    this.tagsToSave = this.getTags();
  }

  isTagsChanged(): void {
    const ids = this.tags.map(t => t.id).sort();
    const displayed = this.tagsDisplayed.map(t => t.id).sort();
    if (ids.length === displayed.length) {
      let res = true;
      for (let index = 0; index < ids.length; index++) {
        if (ids[index] !== displayed[index]) {
          res = false;
          break;
        }
      }
      this.isBtnSaveDisabled = res;
    } else {
      this.isBtnSaveDisabled = false;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe());
  }
}
