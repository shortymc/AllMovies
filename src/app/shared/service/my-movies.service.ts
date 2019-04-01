import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Dropbox } from './../../constant/dropbox';
import { DropboxService } from './dropbox.service';
import { AuthService } from './auth.service';
import { Level } from './../../model/model';
import { Movie } from './../../model/movie';
import { Tag } from './../../model/tag';
import { UtilsService } from './utils.service';
import { ToastService } from './toast.service';
import { Utils } from '../utils';

@Injectable()
export class MyMoviesService {
  myMovies$: BehaviorSubject<Movie[]> = new BehaviorSubject([]);

  constructor(
    private dropboxService: DropboxService,
    private auth: AuthService,
    private serviceUtils: UtilsService,
    private toast: ToastService,
  ) { }

  static moviesToBlob(movies: Movie[]): Blob {
    const theJSON = JSON.stringify(movies, MyMoviesService.removeFields);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static removeFields(key: string, value: string): string {
    if (
      ['synopsis', 'actors', 'crew', 'recommendations', 'videos', 'images', 'checked', 'similars',
        'alternativeTitles', 'character', 'keywords', 'production_countries', 'releaseDates', 'spokenLangs']
        .includes(key)
    ) {
      return undefined;
    }
    return value;
  }

  getFileName(): Promise<string> {
    return new Promise(resolve => resolve(`${Dropbox.DROPBOX_MOVIE_FILE}${this.auth.user$.getValue().id}${Dropbox.DROPBOX_FILE_SUFFIX}`));
  }

  getAll(): void {
    console.log('getAll');
    this.getFileName()
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

  add(moviesToAdd: Movie[]): Promise<boolean> {
    let tempMovieList = [];
    let tempMoviesAdded = [];
    let fileName;
    return this.getFileName().then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then((moviesFromFile: string) => {
      // parse movies
      let movieList = [];
      if (moviesFromFile && moviesFromFile.trim().length > 0) {
        movieList = <Movie[]>JSON.parse(moviesFromFile);
      }
      // filter if not already in collection
      const found = moviesToAdd.filter((add: Movie) => !movieList.map((movie: Movie) => movie.id).includes(add.id));
      if (found.length > 0) {
        tempMoviesAdded = found;
        found.forEach((movie: Movie) => {
          movie.added = new Date();
          movieList.push(movie);
        });
        movieList.sort(Utils.compareObject);
        return movieList;
      } else {
        this.toast.open(Level.info, 'toast.already_added');
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
        this.toast.open(Level.success, 'toast.movies_added', { size: tempMoviesAdded.length / 2 });
      }
      return true;
    }).catch((err) => {
      this.serviceUtils.handleError(err, this.toast);
      return false;
    });
  }

  remove(idToRemove: number[]): Promise<boolean> {
    let tempMovieList = [];
    let fileName;
    return this.getFileName().then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then(moviesFromFile => {
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
        this.toast.open(Level.success, 'toast.movies_removed', { size: idToRemove.length });
      }
      return true;
    }).catch((err) => {
      this.serviceUtils.handlePromiseError(err, this.toast);
      return false;
    });
  }

  /**
   * Replace the movies contains in the given file by the given movies.
   * @param  {Movie[]} moviesToReplace
   * @param  {string} fileName
   * @returns void
   */
  replaceMovies(moviesToReplace: Movie[]): Promise<boolean> {
    let tempMovieList = [];
    let fileName;
    return this.getFileName().then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then(file => {
      let movieList = <Movie[]>JSON.parse(file);
      // Replaces added date with saved ones
      const idList = movieList.map(m => m.id);
      moviesToReplace.forEach(movie => {
        if (idList.includes(movie.id)) {
          movie.added = movieList.find(m => m.id === movie.id).added;
        }
      });
      // Removes from saved list movies to replaced
      movieList = movieList.filter((m: Movie) => !moviesToReplace.map((movie: Movie) => movie.id).includes(m.id)
        || !moviesToReplace.map((movie: Movie) => movie.lang_version).includes(m.lang_version));
      // Push in saved list new movies
      moviesToReplace.forEach((movie: Movie) => movieList.push(movie));
      movieList.sort(Utils.compareObject);
      tempMovieList = movieList;
      return this.dropboxService.uploadFile(MyMoviesService.moviesToBlob(movieList), fileName);
    }).then((res: any) => {
      console.log(res);
      this.myMovies$.next(tempMovieList);
      this.toast.open(Level.success, 'toast.movies_updated', { size: moviesToReplace.length });
      return true;
    }).catch((err) => {
      this.serviceUtils.handleError(err, this.toast);
      return false;
    });
  }

  updateTag(tag: Tag): Promise<boolean> {
    let tempMovieList = [];
    let fileName;
    return this.getFileName().then((file: string) => {
      fileName = file;
      return this.dropboxService.downloadFile(fileName);
    }).then(file => {
      const movieList = <Movie[]>JSON.parse(file);
      // Looking for removed movies from tag
      const moviesHavingTag = movieList.filter(movie => movie.tags && movie.tags.includes(tag.id));
      moviesHavingTag.forEach(movie => {
        if (movie.tags && movie.tags.length > 0 && !tag.movies.map(m => m.id).includes(movie.id)) {
          movie.tags = movie.tags.filter(t => t !== tag.id);
          movie.tags.sort(Utils.compareObject);
        }
      });
      // Looking for added movies in tag
      tag.movies.forEach(movie => {
        movieList.filter(m => m.id === movie.id).forEach(found => {
          if (!found.tags || found.tags.length === 0) {
            found.tags = [tag.id];
          } else if (!found.tags.includes(tag.id)) {
            found.tags.push(tag.id);
            found.tags.sort(Utils.compareObject);
          }
        });
      });
      movieList.sort(Utils.compareObject);
      tempMovieList = movieList;
      return this.dropboxService.uploadFile(MyMoviesService.moviesToBlob(movieList), fileName);
    }).then((res: any) => {
      console.log(res);
      this.myMovies$.next(tempMovieList);
      return true;
    }).catch((err) => {
      this.serviceUtils.handleError(err, this.toast);
      return false;
    });
  }
}
