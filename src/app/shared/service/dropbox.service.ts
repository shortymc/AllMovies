import { Injectable } from '@angular/core';
import * as Dropbox from 'dropbox';

import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { Dropbox as DropboxConstante } from '../../constant/dropbox';

@Injectable()
export class DropboxService {

  constructor(
    private toast: ToastService,
    private serviceUtils: UtilsService
  ) { }

  getDbx(): Dropbox.Dropbox {
    return new Dropbox.Dropbox({ accessToken: DropboxConstante.DROPBOX_TOKEN });
  }

  listFiles(): void {
    this.getDbx().filesListFolder({ path: '' })
      .then((response: Dropbox.files.ListFolderResult) => console.log(response.entries))
      .catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  getPath(fileName: string): string {
    return DropboxConstante.DROPBOX_FOLDER + fileName;
  }

  uploadFile(fichier: Blob, fileName: string): Promise<Dropbox.files.FileMetadata> {
    const pathFile = this.getPath(fileName);
    return this.getDbx().filesDeleteV2({ path: pathFile })
      .then((response: Dropbox.files.DeleteResult) => {
        return this.getDbx().filesUpload({ path: pathFile, contents: fichier });
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  uploadNewFile(fichier: any, fileName: string): Promise<Dropbox.files.FileMetadata> {
    const pathFile = this.getPath(fileName);
    return this.getDbx().filesUpload({ path: pathFile, contents: fichier })
      .then(() => new Promise<void>((resolve, reject) => resolve()))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  downloadFile(fileName: string): Promise<any> {
    console.log('downloadFile', fileName);
    return this.getDbx().filesDownload({ path: this.getPath(fileName) })
      .then((response: any) => {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
          fileReader.onerror = () => {
            fileReader.abort();
            reject(new DOMException('Problem parsing input file.'));
          };
          fileReader.onload = () => {
            return resolve(fileReader.result.toString());
          };
          fileReader.readAsText(response.fileBlob);
        });
      })
      .catch((err) => this.serviceUtils.handleError(err, this.toast));
  }
}
