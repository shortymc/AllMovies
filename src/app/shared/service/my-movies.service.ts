import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { DropboxService } from './dropbox.service';
import { AuthService } from './auth.service';
import { Movie } from './../../model/movie';
import { UtilsService } from './utils.service';
import { ToastService } from './toast.service';
import { Utils } from '../utils';

@Injectable()
export class MyMoviesService {
  myMovies$ = new BehaviorSubject([]);

  constructor(
    private dropboxService: DropboxService,
    private auth: AuthService,
    private translate: TranslateService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
  ) { }

  static moviesToBlob(movies: Movie[]): Blob {
    const theJSON = JSON.stringify(movies, MyMoviesService.removeFields);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static removeFields(key: string, value: string): string {
    if (['synopsis', 'actors', 'crew', 'recommendations', 'videos', 'images'].includes(key)) {
      return undefined;
    }
    return value;
  }

  getAll(): void {
    console.log('getAll');
    this.auth.getFileName()
      .then((fileName: string) => this.dropboxService.downloadFile(fileName))
      .then((moviesFromFile: string) => {
        if (moviesFromFile && moviesFromFile.trim().length > 0) {
          return <Movie[]>JSON.parse(moviesFromFile);
        } else {
          return [];
        }
      })
      .then((movies: Movie[]) => {
        this.myMovies$.next(movies);
      }).catch(err => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  add(moviesToAdd: Movie[], fileName: string): void {
    let tempMovieList = [];
    let tempMoviesAdded = [];
    // download user file
    this.dropboxService.downloadFile(fileName).then((moviesFromFile: string) => {
      // parse movies
      let movieList = [];
      if (moviesFromFile && moviesFromFile.trim().length > 0) {
        movieList = <Movie[]>JSON.parse(moviesFromFile);
      }
      // filter if not already in collection
      const found = moviesToAdd.filter((add: Movie) => !movieList.map((movie: Movie) => movie.id).includes(add.id));
      if (found.length > 0) {
        tempMoviesAdded = found;
        found.forEach((movie: Movie) => movieList.push(movie));
        movieList.sort(Utils.compareObject);
        return movieList;
      } else {
        this.toast.open(this.translate.instant('toast.already_added'));
        return [];
      }
    }).then((list: Movie[]) => {
      if (list && list.length !== 0) {
        tempMovieList = list;
        // replace with new array movies
        return this.dropboxService.uploadFile(MyMoviesService.moviesToBlob(list), fileName);
      } else {
        return undefined;
      }
    }).then((res: any) => {
      console.log(res);
      if (res) {
        // all good, modifies inner data
        console.log('myMovies', tempMovieList);
        this.myMovies$.next(tempMovieList);
        this.toast.open(this.translate.instant('toast.movies_added', { size: tempMoviesAdded.length / 2 }));
      }
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }

  remove(idToRemove: number[], fileName: string): void {
    let tempMovieList = [];
    // download my movies
    this.dropboxService.downloadFile(fileName).then(moviesFromFile => {
      // parse them
      let movieList = <Movie[]>JSON.parse(moviesFromFile);
      if (idToRemove.length > 0) {
        // remove given movies
        idToRemove.forEach((id: number) => movieList = movieList.filter((film: Movie) => film.id !== id));
        tempMovieList = movieList;
        // repplace file with new movie array
        return this.dropboxService.uploadFile(MyMoviesService.moviesToBlob(movieList), fileName);
      } else {
        return undefined;
      }
    }).then((res: any) => {
      console.log(res);
      if (res) {
        // if ok, emit new array and toast
        this.myMovies$.next(tempMovieList);
        this.toast.open(this.translate.instant('toast.movies_removed', { size: idToRemove.length }));
      }
    }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  /**
   * Replace the movies contains in the given file by the given movies.
   * @param  {Movie[]} moviesToReplace
   * @param  {string} fileName
   * @returns void
   */
  replaceMovies(moviesToReplace: Movie[], fileName: string): void {
    let tempMovieList = [];
    this.dropboxService.downloadFile(fileName).then(file => {
      let movieList = <Movie[]>JSON.parse(file);
      movieList = movieList.filter((m: Movie) => !moviesToReplace.map((movie: Movie) => movie.id).includes(m.id)
        || !moviesToReplace.map((movie: Movie) => movie.lang_version).includes(m.lang_version));
      moviesToReplace.forEach((movie: Movie) => movieList.push(movie));
      movieList.sort(Utils.compareObject);
      tempMovieList = movieList;
      return this.dropboxService.uploadFile(MyMoviesService.moviesToBlob(movieList), fileName);
    }).then((res: any) => {
      console.log(res);
      this.myMovies$.next(tempMovieList);
      this.toast.open(this.translate.instant('toast.movies_updated', { size: moviesToReplace.length }));
    }).catch((err) => this.serviceUtils.handleError(err, this.toast));
  }
}
