import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {DropboxService} from './dropbox.service';
import {AuthService} from './auth.service';
import {Level} from '../../model/model';
import {Tag} from '../../model/tag';
import {CapitalizeWordPipe} from './../pipes/capitalizeWord.pipe';
import {Dropbox} from './../../constant/dropbox';
import {UtilsService} from './utils.service';
import {ToastService} from './toast.service';
import {Utils} from '../utils';

@Injectable({
  providedIn: 'root',
})
export class MyTagsService {
  myTags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

  constructor(
    private dropboxService: DropboxService,
    private auth: AuthService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
    private capitalize: CapitalizeWordPipe
  ) {}

  static tagsToBlob(tags: Tag[]): Blob {
    const theJSON = '[' + tags.map(tag => Tag.toJson(tag)).join(',') + ']';
    return new Blob([theJSON], {type: 'text/json'});
  }

  getFileName(): Promise<string> {
    return new Promise(resolve =>
      resolve(
        `${Dropbox.DROPBOX_TAG_FILE}${this.auth.user$.getValue().id}${
          Dropbox.DROPBOX_FILE_SUFFIX
        }`
      )
    );
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
      })
      .catch(err => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  add(toAdd: Tag): Promise<Tag | undefined> {
    let tempTagList: Tag[] = [];
    let fileName: string;
    return this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      })
      .then((tagsFromFile: string) => {
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
      })
      .then((list: Tag[]) => {
        if (list && list.length !== 0) {
          tempTagList = list;
          // replace with new array tags
          return this.dropboxService.uploadFile(
            MyTagsService.tagsToBlob(list),
            fileName
          );
        } else {
          return undefined;
        }
      })
      .then((res: any) => {
        console.log(res);
        if (res) {
          // all good, modifies inner data
          console.log('myTags', tempTagList);
          this.myTags$.next(tempTagList);
          this.toast.open(Level.success, 'toast.tags_added');
        }
        return toAdd;
      })
      .catch(err => {
        this.serviceUtils.handleError(err, this.toast);
        return undefined;
      });
  }

  remove(idToRemove: number[]): void {
    let tempTagList: Tag[] = [];
    let fileName: string;
    this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      })
      .then((tagsFromFile: string) => {
        // parse them
        let tagList = <Tag[]>JSON.parse(tagsFromFile);
        if (idToRemove.length > 0) {
          // remove given tags
          idToRemove.forEach(
            (id: number) =>
              (tagList = tagList.filter((tag: Tag) => tag.id !== id))
          );
          tempTagList = tagList;
          // replace file with new tag array
          return this.dropboxService.uploadFile(
            MyTagsService.tagsToBlob(tagList),
            fileName
          );
        } else {
          return undefined;
        }
      })
      .then((res: any) => {
        console.log(res);
        if (res) {
          // if ok, emit new array and toast
          this.myTags$.next(tempTagList);
          this.toast.open(Level.success, 'toast.tags_removed', {
            size: idToRemove.length,
          });
        }
      })
      .catch(err => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  updateTag(tag: Tag): Promise<boolean> {
    let tempTagList: Tag[] = [];
    let fileName: string;
    return this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      })
      .then((tagsFromFile: string) => {
        // parse tags
        let tagList: Tag[] = [];
        if (tagsFromFile && tagsFromFile.trim().length > 0) {
          tagList = <Tag[]>JSON.parse(tagsFromFile);
        }
        // Find tag to update and replace its movies
        let toUpdate = tagList.find(t => t.id === tag.id);
        toUpdate = Tag.clone(tag);
        toUpdate.datas.sort(Utils.compareObject);
        tagList.splice(tagList.map(t => t.id).indexOf(tag.id), 1, tag);
        tempTagList = tagList;
        return this.dropboxService.uploadFile(
          MyTagsService.tagsToBlob(tagList),
          fileName
        );
      })
      .then((res: any) => {
        console.log(res);
        this.myTags$.next(tempTagList);
        this.toast.open(Level.success, 'toast.tags_updated');
        return true;
      })
      .catch(err => {
        this.serviceUtils.handleError(err, this.toast);
        return false;
      });
  }

  replaceTags(tagsToReplace: Tag[]): Promise<boolean> {
    let tempTagList: Tag[] = [];
    let fileName: string;
    return this.getFileName()
      .then((file: string) => {
        // download file
        fileName = file;
        return this.dropboxService.downloadFile(fileName);
      })
      .then((tagsFromFile: string) => {
        let tagList = <Tag[]>JSON.parse(tagsFromFile);
        // Removes from saved list the tags to replace
        tagList = tagList.filter(
          (m: Tag) => !tagsToReplace.map((tag: Tag) => tag.id).includes(m.id)
        );
        // Push in saved list new tags
        tagList.push(...tagsToReplace);
        tagList.sort(Utils.compareObject);
        tempTagList = tagList;
        return this.dropboxService.uploadFile(
          MyTagsService.tagsToBlob(tagList),
          fileName
        );
      })
      .then((res: any) => {
        console.log(res);
        this.myTags$.next(tempTagList);
        this.toast.open(Level.success, 'toast.tags_updated', {
          size: tagsToReplace.length,
        });
        return true;
      })
      .catch(err => {
        this.serviceUtils.handleError(err, this.toast);
        return false;
      });
  }
}
