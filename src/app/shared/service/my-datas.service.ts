import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Dropbox } from '../../constant/dropbox';
import { DropboxService } from './dropbox.service';
import { Data, DataI18N } from './../../model/data';
import { AuthService } from './auth.service';
import { Level } from '../../model/model';
import { UtilsService } from './utils.service';
import { ToastService } from './toast.service';
import { Utils } from '../utils';

@Injectable()
export class MyDatasService<T extends Data> {
  myDatas$: BehaviorSubject<T[]> = new BehaviorSubject([]);

  constructor(
    private dropboxService: DropboxService,
    private auth: AuthService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
  ) { }

  private format(datas: T[]): T[] {
    const byId = Utils.groupBy(datas, 'id');
    return byId.map(by => {
      let result: T;
      datas.filter(m => m.id === +by.key).forEach(data => {
        if (!result) {
          result = data;
          result.translation = new Map();
        }
        result.translation.set(data.lang_version, new DataI18N(data.title, data.affiche, data.genres));
      });
      return result;
    });
  }

  private fromJson(json: string): T[] {
    if (json && json.trim().length > 0) {
      const datas = <T[]>JSON.parse(json);
      datas.forEach(d => {
        const mapResult = new Map();
        d.translation.forEach(tr => mapResult.set(tr[0], tr[1]));
        d.translation = mapResult;
      });
      return datas;
    } else {
      return [];
    }
  }

  private toJson(datas: T[]): string {
    return '[' + datas.map(data => {
      const translation = Utils.mapToJson(<Map<any, any>>data.translation);
      const json = JSON.stringify(data, data.removeFields);
      return json.replace('"translation":{}', '"translation":' + translation);
    }).join(',') + ']';
  }

  private toBlob(datas: T[]): Blob {
    const theJSON = this.toJson(datas);
    return new Blob([theJSON], { type: 'text/json' });
  }

  getFileName(isMovie: boolean): Promise<string> {
    return new Promise(resolve => resolve(
      `${isMovie ? Dropbox.DROPBOX_MOVIE_FILE : Dropbox.DROPBOX_SERIE_FILE}${this.auth.user$.getValue().id}${Dropbox.DROPBOX_FILE_SUFFIX}`
    ));
  }

  getAll(isMovie: boolean): void {
    console.log('getAll');
    this.getFileName(isMovie)
      .then((fileName: string) => this.dropboxService.downloadFile(fileName))
      .then((datasFromFile: string) => this.fromJson(datasFromFile))
      .then((datas: T[]) => {
        console.log(isMovie ? 'movies' : 'series', datas);
        this.myDatas$.next(datas);
      }).catch(err => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  add(datasToAdd: T[], isMovie: boolean): Promise<boolean> {
    let tempDataList = [];
    let tempDatasAdded = [];
    let fileName;
    const mapped = this.format(datasToAdd);
    return this.getFileName(isMovie).then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then((datasFromFile: string) => {
      // parse datas
      let dataList = [];
      if (datasFromFile && datasFromFile.trim().length > 0) {
        dataList = this.fromJson(datasFromFile);
      }
      // filter if not already in collection
      const found = mapped.filter((add: T) => !dataList.map((data: T) => data.id).includes(add.id));
      if (found.length > 0) {
        tempDatasAdded = found;
        found.forEach((data: T) => {
          data.added = new Date();
          dataList.push(data);
        });
        dataList.sort(Utils.compareObject);
        return dataList;
      } else {
        this.toast.open(Level.info, 'toast.already_added');
        return [];
      }
    }).then((list: T[]) => {
      if (list && list.length !== 0) {
        tempDataList = list;
        // replace with new array datas
        return this.dropboxService.uploadFile(this.toBlob(list), fileName);
      } else {
        return undefined;
      }
    }).then((res: any) => {
      console.log(res);
      if (res) {
        // all good, modifies inner data
        console.log('myDatas', tempDataList);
        this.myDatas$.next(tempDataList);
        this.toast.open(Level.success, isMovie ? 'toast.movies_added' : 'toast.series_added', { size: tempDatasAdded.length });
      }
      return true;
    }).catch((err) => {
      this.serviceUtils.handleError(err, this.toast);
      return false;
    });
  }

  remove(idToRemove: number[], isMovie: boolean): Promise<boolean> {
    let tempDataList = [];
    let fileName;
    return this.getFileName(isMovie).then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then(datasFromFile => {
      // parse them
      let dataList = this.fromJson(datasFromFile);
      if (idToRemove.length > 0) {
        // remove given datas
        idToRemove.forEach((id: number) => dataList = dataList.filter((film: T) => film.id !== id));
        tempDataList = dataList;
        // replace file with new data array
        return this.dropboxService.uploadFile(this.toBlob(dataList), fileName);
      } else {
        return undefined;
      }
    }).then((res: any) => {
      console.log(res);
      if (res) {
        // if ok, emit new array and toast
        this.myDatas$.next(tempDataList);
        this.toast.open(Level.success, isMovie ? 'toast.movies_removed' : 'toast.series_removed', { size: idToRemove.length });
      }
      return true;
    }).catch((err) => {
      this.serviceUtils.handlePromiseError(err, this.toast);
      return false;
    });
  }

  /**
   * Replace the datas contains in the given file by the given datas.
   * @param  {T[]} datasToUpdate the datas replacing
   * @returns void
   */
  update(datasToUpdate: T[], isMovie: boolean): Promise<boolean> {
    let tempDataList = [];
    let fileName;
    let mapped = datasToUpdate;
    if (datasToUpdate.every(m => m.translation === undefined)) {
      mapped = this.format(datasToUpdate);
    }
    return this.getFileName(isMovie).then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then(file => {
      let dataList = this.fromJson(file);
      // Keeps added and tags fields from being replaced
      const idList = dataList.map(m => m.id);
      mapped.forEach(data => {
        if (idList.includes(data.id)) {
          data.added = dataList.find(m => m.id === data.id).added;
        }
      });
      // Removes from saved list datas to replaced
      dataList = dataList.filter((m: T) => !mapped.map((data: T) => data.id).includes(m.id)
        || !mapped.map((data: T) => data.lang_version).includes(m.lang_version));
      // Push in saved list new datas
      mapped.forEach((data: T) => dataList.push(data));
      dataList.sort(Utils.compareObject);
      tempDataList = dataList;
      return this.dropboxService.uploadFile(this.toBlob(dataList), fileName);
    }).then((res: any) => {
      console.log(res);
      this.myDatas$.next(tempDataList);
      this.toast.open(Level.success, isMovie ? 'toast.movies_updated' : 'toast.series_updated', { size: mapped.length });
      return true;
    }).catch((err) => {
      this.serviceUtils.handleError(err, this.toast);
      return false;
    });
  }
}
