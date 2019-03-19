import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { DropboxService } from './dropbox.service';
import { AuthService } from './auth.service';
import { Level } from '../../model/model';
import { Tag } from '../../model/tag';
import { Dropbox } from './../../constant/dropbox';
import { UtilsService } from './utils.service';
import { User } from './../../model/user';
import { ToastService } from './toast.service';
import { Utils } from '../utils';

@Injectable()
export class MyTagsService {
  myTags$ = new BehaviorSubject([]);

  constructor(
    private dropboxService: DropboxService,
    private auth: AuthService,
    private translate: TranslateService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
  ) { }

  static tagsToBlob(tags: Tag[]): Blob {
    const theJSON = JSON.stringify(tags);
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

  add(tagsToAdd: Tag[], fileName: string): void {
    let tempTagList = [];
    let tempTagsAdded = [];
    // download user file
    this.dropboxService.downloadFile(fileName).then((tagsFromFile: string) => {
      // parse tags
      let tagList = [];
      if (tagsFromFile && tagsFromFile.trim().length > 0) {
        tagList = <Tag[]>JSON.parse(tagsFromFile);
      }
      // filter if not already in collection
      const found = tagsToAdd.filter((add: Tag) => !tagList.map((tag: Tag) => tag.id).includes(add.id));
      if (found.length > 0) {
        tempTagsAdded = found;
        found.forEach((tag: Tag) => tagList.push(tag));
        tagList.sort(Utils.compareObject);
        return tagList;
      } else {
        this.toast.open(this.translate.instant('toast.already_added'), Level.info);
        return [];
      }
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
        this.toast.open(this.translate.instant('toast.tags_added', { size: tempTagsAdded.length / 2 }), Level.success);
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  remove(idToRemove: number[], fileName: string): void {
    let tempTagList = [];
    // download my tags
    this.dropboxService.downloadFile(fileName).then(tagsFromFile => {
      // parse them
      let tagList = <Tag[]>JSON.parse(tagsFromFile);
      if (idToRemove.length > 0) {
        // remove given tags
        idToRemove.forEach((id: number) => tagList = tagList.filter((film: Tag) => film.id !== id));
        tempTagList = tagList;
        // repplace file with new tag array
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

  /**
   * Replace the tags contains in the given file by the given tags.
   * @param  {Tag[]} tagsToReplace
   * @param  {string} fileName
   * @returns void
   */
  // replaceTags(tagsToReplace: Tag[], fileName: string): void {
  //   let tempTagList = [];
  //   this.dropboxService.downloadFile(fileName).then(file => {
  //     let tagList = <Tag[]>JSON.parse(file);
  //     // Replaces added date with saved ones
  //     const idList = tagList.map(m => m.id);
  //     tagsToReplace.forEach(tag => {
  //       if (idList.includes(tag.id)) {
  //         tag.added = tagList.find(m => m.id === tag.id).added;
  //       }
  //     });
  //     // Removes from saved list tags to replaced
  //     tagList = tagList.filter((m: Tag) => !tagsToReplace.map((tag: Tag) => tag.id).includes(m.id)
  //       || !tagsToReplace.map((tag: Tag) => tag.lang_version).includes(m.lang_version));
  //     // Push in saved list new tags
  //     tagsToReplace.forEach((tag: Tag) => tagList.push(tag));
  //     tagList.sort(Utils.compareObject);
  //     tempTagList = tagList;
  //     return this.dropboxService.uploadFile(MyTagsService.tagsToBlob(tagList), fileName);
  //   }).then((res: any) => {
  //     console.log(res);
  //     this.myTags$.next(tempTagList);
  //     this.toast.open(this.translate.instant('toast.tags_updated', { size: tagsToReplace.length }), Level.success);
  //   }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  // }
}