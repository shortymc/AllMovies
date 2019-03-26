import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faTimes, faPen } from '@fortawesome/free-solid-svg-icons';
import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { Movie } from './../../../model/movie';
import { Tag } from './../../../model/tag';
import { MyMoviesService } from '../../service/my-movies.service';
import { Level } from './../../../model/model';
import { AuthService } from './../../service/auth.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-list-tags',
  templateUrl: './list-tags.component.html',
  styleUrls: ['./list-tags.component.scss']
})
export class ListTagsComponent implements OnChanges {
  @Input()
  tags: Tag[];
  @Input()
  movie: Movie;
  tagDisplayed: Tag[];
  editing = false;

  faRemove = faTimes;
  faEdit = faPen;
  faSave = faSave;

  constructor(
    private auth: AuthService,
    private myMoviesService: MyMoviesService,
    private toast: ToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tags = changes.tags.currentValue ? changes.tags.currentValue.map(tag => Tag.clone(<Tag>tag)) : this.tags;
    this.movie = changes.movie ? changes.movie.currentValue : this.movie;
    this.editing = false;
    this.tagDisplayed = this.tags;
  }

  add(tag: Tag): void {
    if (this.tags.map(t => t.id).includes(tag.id)) {
      this.toast.open('toast.already_added', Level.warning);
    } else {
      this.tagDisplayed.push(tag);
    }
  }

  remove(tag: Tag): void {
    this.tagDisplayed = this.tagDisplayed.filter(t => t.id !== tag.id);
  }

  save(): void {
    // this.auth.getFileName().then(file => this.myMoviesService.updateTag(this.selectedTag, file)).then(() => {
    //   this.myMoviesService.updateTag();
    //   this.nbChecked = 0;
    //   this.selectedTag = undefined;
    // });
    this.editing = false;
  }

  cancel(): void {
    this.editing = false;
    this.tagDisplayed = this.tags;
  }

}
