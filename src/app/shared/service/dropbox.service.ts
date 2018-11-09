import { Injectable } from '@angular/core';
import * as Dropbox from 'dropbox';
import { TranslateService } from '@ngx-translate/core';

import { Movie } from '../../model/movie';
import { Utils } from '../../shared/utils';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { Dropbox as DropboxConstante } from '../../constant/dropbox';

@Injectable()
export class DropboxService {
  constructor(private toast: ToastService, private translate: TranslateService, private serviceUtils: UtilsService) { }

  /**
   * @param  {Movie[]} movies
   * @returns Blob
   */
  static moviesToBlob(movies: Movie[]): Blob {
    const theJSON = JSON.stringify(movies, DropboxService.removeFields);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static removeFields(key: string, value: string): string {
    if (['synopsis', 'actors', 'crew', 'recommendations', 'videos', 'images'].includes(key)) {
      return undefined;
    }
    return value;
  }

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

  uploadNewFile(fichier: string, fileName: string): Promise<Dropbox.files.FileMetadata> {
    const pathFile = this.getPath(fileName);
    return this.getDbx().filesUpload({ path: pathFile, contents: fichier })
      .then(() => new Promise((resolve, reject) => resolve()))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  downloadFile(fileName: string): Promise<any> {
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

  addMovie(movie: Movie, fileName: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = [];
      if (file && file.trim().length > 0) {
        movieList = <Movie[]>JSON.parse(file);
      }
      const found = movieList.find((film) => film.id === movie.id);
      if (!found) {
        movieList.push(movie);
        movieList.sort(Utils.compareObject);
        this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
          .then((res: Dropbox.files.FileMetadata) => {
            console.log(res);
            this.toast.open(this.translate.instant('toast.movie_added'));
          }).catch((err) => this.serviceUtils.handleError(err, this.toast));
      } else {
        this.toast.open(this.translate.instant('toast.already_added'));
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  addMovieList(moviesToAdd: Movie[], fileName: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = [];
      if (file && file.trim().length > 0) {
        movieList = <Movie[]>JSON.parse(file);
      }
      const found = moviesToAdd.filter((add: Movie) => !movieList.map((movie: Movie) => movie.id).includes(add.id));

      if (found.length > 0) {
        found.forEach((movie: Movie) => movieList.push(movie));
        movieList.sort(Utils.compareObject);
        this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
          .then((res: Dropbox.files.FileMetadata) => {
            console.log(res);
            this.toast.open(this.translate.instant('toast.movies_added', { size: found.length / 2 }));
          }).catch((err) => this.serviceUtils.handleError(err, this.toast));
      } else {
        this.toast.open(this.translate.instant('toast.already_added'));
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  removeMovie(id: number, fileName: string): void {
    this.downloadFile(fileName).then(file => {
      const movieList = <Movie[]>JSON.parse(file);
      this.uploadFile(DropboxService.moviesToBlob(movieList.filter((film: Movie) => film.id !== id)), fileName)
        .then((res: Dropbox.files.FileMetadata) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.movie_removed'));
        }).catch((err) => this.serviceUtils.handleError(err, this.toast));
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  removeMovieList(idToRemove: number[], fileName: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = <Movie[]>JSON.parse(file);

      if (idToRemove.length > 0) {
        idToRemove.forEach((id: number) => movieList = movieList.filter((film: Movie) => film.id !== id));
        this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
          .then((res: Dropbox.files.FileMetadata) => {
            console.log(res);
            this.toast.open(this.translate.instant('toast.movies_removed', { size: idToRemove.length }));
          }).catch((err) => this.serviceUtils.handleError(err, this.toast));
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  getAllMovies(fileName: string): Promise<Movie[]> {
    return this.downloadFile(fileName).then(file => {
      if (file && file.trim().length > 0) {
        return <Movie[]>JSON.parse(file);
      } else {
        return [];
      }
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  /**
   * Replace the movies contains in the given file by the given movies.
   * @param  {Movie[]} moviesToReplace
   * @param  {string} fileName
   * @returns void
   */
  replaceMovies(moviesToReplace: Movie[], fileName: string, language: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = <Movie[]>JSON.parse(file);
      movieList = movieList.filter((m: Movie) => !moviesToReplace.map((movie: Movie) => movie.id).includes(m.id)
        || !moviesToReplace.map((movie: Movie) => movie.lang_version).includes(m.lang_version));

      moviesToReplace.forEach((movie: Movie) => movieList.push(movie));
      movieList.sort(Utils.compareObject);
      this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
        .then((res: Dropbox.files.FileMetadata) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.movies_updated', { size: moviesToReplace.length }));
        }).catch((err) => this.serviceUtils.handleError(err, this.toast));
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }
}
