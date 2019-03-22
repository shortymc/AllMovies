import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { DropboxService } from './dropbox.service';
import { AuthService } from './auth.service';
import { Level } from '../../model/model';
import { TagMovie } from './../../model/tag';
import { Tag } from '../../model/tag';
import { CapitalizeWordPipe } from './../pipes/capitalizeWord.pipe';
import { Dropbox } from './../../constant/dropbox';
import { UtilsService } from './utils.service';
import { User } from './../../model/user';
import { ToastService } from './toast.service';
import { Utils } from '../utils';

@Injectable()
export class MyTagsService {
  myTags$: BehaviorSubject<Tag[]> = new BehaviorSubject([]);

  constructor(
    private dropboxService: DropboxService,
    private auth: AuthService,
    private translate: TranslateService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
    private capitalize: CapitalizeWordPipe
  ) { }

  static tagsToBlob(tags: Tag[]): Blob {
    const theJSON = '[' + tags.map(tag => Tag.toJson(tag)).join(',') + ']';
    return new Blob([theJSON], { type: 'text/json' });
  }

  getFileName(): Promise<string> {
    return this.auth.getCurrentUser().then((user: User) => `${Dropbox.DROPBOX_TAG_FILE}${user.id}${Dropbox.DROPBOX_FILE_SUFFIX}`);
  }

  getAll(): void {
    this.getFileName()
      .then((fileName: string) => this.dropboxService.downloadFile(fileName))
      .then((tagsFromFile: string) => {
        if (tagsFromFile && tagsFromFile.trim().length > 0) {
          return <Tag[]>JSON.parse(tagsFromFile);
        } else {
          return [];
        }
      })
      .then((tags: Tag[]) => {
        this.myTags$.next(tags);
      }).catch(err => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  add(toAdd: Tag): void {
    let tempTagList = [];
    let fileName;
    this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      }).then((tagsFromFile: string) => {
        // parse tags
        let tagList: Tag[] = [];
        if (tagsFromFile && tagsFromFile.trim().length > 0) {
          tagList = <Tag[]>JSON.parse(tagsFromFile);
        }
        // add tag to list
        tagList.sort(Utils.compareObject);
        toAdd.id = tagList.length > 0 ? tagList[tagList.length - 1].id + 1 : 1;
        toAdd.label = this.capitalize.transform(toAdd.label);
        tagList.push(toAdd);
        return tagList;
      }).then((list: Tag[]) => {
        if (list && list.length !== 0) {
          tempTagList = list;
          // replace with new array tags
          return this.dropboxService.uploadFile(MyTagsService.tagsToBlob(list), fileName);
        } else {
          return undefined;
        }
      }).then((res: any) => {
        console.log(res);
        if (res) {
          // all good, modifies inner data
          console.log('myTags', tempTagList);
          this.myTags$.next(tempTagList);
          this.toast.open(this.translate.instant('toast.tags_added'), Level.success);
        }
      }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  remove(idToRemove: number[]): void {
    let tempTagList = [];
    let fileName;
    this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      }).then((tagsFromFile: string) => {
        // parse them
        let tagList = <Tag[]>JSON.parse(tagsFromFile);
        if (idToRemove.length > 0) {
          // remove given tags
          idToRemove.forEach((id: number) => tagList = tagList.filter((tag: Tag) => tag.id !== id));
          tempTagList = tagList;
          // replace file with new tag array
          return this.dropboxService.uploadFile(MyTagsService.tagsToBlob(tagList), fileName);
        } else {
          return undefined;
        }
      }).then((res: any) => {
        console.log(res);
        if (res) {
          // if ok, emit new array and toast
          this.myTags$.next(tempTagList);
          this.toast.open(this.translate.instant('toast.tags_removed', { size: idToRemove.length }), Level.success);
        }
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  updateTag(tag: Tag): void {
    let tempTagList = [];
    let fileName;
    this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      }).then((tagsFromFile: string) => {
        // parse tags
        let tagList: Tag[] = [];
        if (tagsFromFile && tagsFromFile.trim().length > 0) {
          tagList = <Tag[]>JSON.parse(tagsFromFile);
        }
        // Find tag to update and replace its movies
        let toUpdate = tagList.find(t => t.id === tag.id);
        toUpdate = Tag.clone(tag);
        toUpdate.movies.sort(Utils.compareObject);
        tagList.splice(tagList.map(t => t.id).indexOf(tag.id), 1, tag);
        tempTagList = tagList;
        return this.dropboxService.uploadFile(MyTagsService.tagsToBlob(tagList), fileName);
      }).then((res: any) => {
        console.log(res);
        this.myTags$.next(tempTagList);
        this.toast.open(this.translate.instant('toast.tags_updated'), Level.success);
      }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }
}
