import { Injectable } from '@angular/core';
import Dropbox = require('dropbox');
import { Movie } from '../model/movie';
import { Url } from '../constant/url';
import { Utils } from '../shared/utils';
import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class DropboxService {
  constructor(private toast: ToastService, private translate: TranslateService, private serviceUtils: ServiceUtils) { }

  /**
   * @param  {Movie[]} movies
   * @returns any
   */
  static moviesToBlob(movies: Movie[]): any {
    const theJSON = JSON.stringify(movies, DropboxService.removeFields);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static removeFields(key: any, value: any): any {
    if (['synopsis', 'actors', 'crew', 'recommendations', 'videos', 'images'].includes(key)) {
      return undefined;
    }
    return value;
  }

  getDbx(): any {
    return new Dropbox({ accessToken: Url.DROPBOX_TOKEN });
  }

  listFiles(): void {
    this.getDbx().filesListFolder({ path: '' })
      .then((response: any) => console.log(response.entries))
      .catch(this.serviceUtils.handleError);
  }

  getPath(fileName: string): string {
    return Url.DROPBOX_FOLDER + fileName;
  }

  uploadFile(fichier: any, fileName: string): Promise<any> {
    const pathFile = this.getPath(fileName);
    return this.getDbx().filesDeleteV2({ path: pathFile })
      .then((response: any) => {
        return this.getDbx().filesUpload({ path: pathFile, contents: fichier });
      }).catch(this.serviceUtils.handlePromiseError);
  }

  uploadNewFile(fichier: any, fileName: string): Promise<void> {
    const pathFile = this.getPath(fileName);
    return this.getDbx().filesUpload({ path: pathFile, contents: fichier })
      .then(() => new Promise((resolve, reject) => resolve()))
      .catch(this.serviceUtils.handlePromiseError);
  }

  downloadFile(fileName: string): Promise<string> {
    return this.getDbx().filesDownload({ path: this.getPath(fileName) })
      .then((response: any) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = (event) => resolve(fileReader.result as string[]);
          fileReader.onabort = reject;
          fileReader.onerror = reject;
          fileReader.readAsText(response.fileBlob);
        }) as Promise<string[]>;
      }).catch(this.serviceUtils.handleError);
  }

  addMovie(movie: Movie, fileName: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = [];
      if (file && file.trim().length > 0) {
        movieList = <Movie[]>JSON.parse(file);
      }
      const found = movieList.find(function(film) {
        return film.id === movie.id;
      });
      if (!found) {
        movieList.push(movie);
        movieList.sort(Utils.compareObject);
        this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
          .then((res: any) => {
            console.log(res);
            this.toast.open(this.translate.instant('toast.movie_added'));
          }).catch(this.serviceUtils.handleError);
      } else {
        this.toast.open(this.translate.instant('toast.already_added'));
      }
    }).catch(this.serviceUtils.handleError);
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
          .then((res: any) => {
            console.log(res);
            this.toast.open(this.translate.instant('toast.movies_added', { size: found.length / 2 }));
          }).catch(this.serviceUtils.handleError);
      } else {
        this.toast.open(this.translate.instant('toast.already_added'));
      }
    }).catch(this.serviceUtils.handleError);
  }

  removeMovie(id: number, fileName: string): void {
    this.downloadFile(fileName).then(file => {
      const movieList = <Movie[]>JSON.parse(file);
      this.uploadFile(DropboxService.moviesToBlob(movieList.filter((film: Movie) => film.id !== id)), fileName)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.movie_removed'));
        }).catch(this.serviceUtils.handleError);
    }).catch(this.serviceUtils.handleError);
  }

  removeMovieList(idToRemove: number[], fileName: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = <Movie[]>JSON.parse(file);

      if (idToRemove.length > 0) {
        idToRemove.forEach((id: number) => movieList = movieList.filter((film: Movie) => film.id !== id));
        this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
          .then((res: any) => {
            console.log(res);
            this.toast.open(this.translate.instant('toast.movies_removed', { size: idToRemove.length }));
          }).catch(this.serviceUtils.handleError);
      }
    }).catch(this.serviceUtils.handleError);
  }

  getAllMovies(fileName: string): Promise<Movie[]> {
    return this.downloadFile(fileName).then(file => {
      if (file && file.trim().length > 0) {
        return <Movie[]>JSON.parse(file);
      } else {
        return [];
      }
    }).catch(this.serviceUtils.handlePromiseError);
  }

  /**
   * Replace the movies contains in the given file by the given movies.
   * @param  {Movie[]} moviesToReplace
   * @param  {string} fileName
   * @returns void
   */
  replaceMovies(moviesToReplace: Movie[], fileName: string): void {
    this.downloadFile(fileName).then(file => {
      let movieList = <Movie[]>JSON.parse(file);
      movieList = movieList.filter((m: Movie) => !moviesToReplace.map((movie: Movie) => movie.id).includes(m.id));

      moviesToReplace.forEach((movie: Movie) => movieList.push(movie));
      movieList.sort(Utils.compareObject);
      this.uploadFile(DropboxService.moviesToBlob(movieList), fileName)
        .then((res: any) => {
          console.log(res);
          this.toast.open(this.translate.instant('toast.movies_updated', { size: moviesToReplace.length }));
        }).catch(this.serviceUtils.handleError);
    }).catch(this.serviceUtils.handleError);
  }
}
