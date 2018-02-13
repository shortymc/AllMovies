import { Injectable } from '@angular/core';
import Dropbox = require('dropbox');
import { Movie } from '../model/movie';
import { Url } from '../constant/url';

@Injectable()
export class DropboxService {
    constructor() { }

    getDbx(): any {
        return new Dropbox({ accessToken: Url.DROPBOX_TOKEN });
    }

    listFiles(): void {
        this.getDbx().filesListFolder({ path: '' })
            .then((response: any) => console.log(response.entries))
            .catch((error: any) => console.error(error));
    }

    getPath(fileName: string): string {
        return Url.DROPBOX_FOLDER + fileName;
    }

    uploadFile(fichier: any, fileName: string): void {
        const pathFile = this.getPath(fileName);
        this.getDbx().filesDeleteV2({ path: pathFile })
            .then((response: any) => {
                this.getDbx().filesUpload({ path: pathFile, contents: fichier })
                    .then((res: any) => console.log(res))
                    .catch((error: any) => console.error(error));
            })
            .catch((error: any) => console.error(error));
    }

    downloadFile(fileName: string): Promise<string> {
        return this.getDbx().filesDownload({ path: this.getPath(fileName) })
            .then((response: any) => {
                return new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.onload = (event) => resolve(fileReader.result as string[]);
                    fileReader.onabort = (event) => reject(event);
                    fileReader.onerror = (event) => reject(event);
                    fileReader.readAsText(response.fileBlob);
                }) as Promise<string[]>;
            })
            .catch((error: any) => console.error(error));
    }

    addMovie(movie: Movie, fileName: string): void {
        this.downloadFile(fileName).then(file => {
            const movieList = <Movie[]>JSON.parse(file);
            const found = movieList.find(function (film) {
                return film.id === movie.id;
            });
            if (!found) {
                movieList.push(movie);
                movieList.sort(this.compareMovie);
                this.uploadFile(this.movieToBlob(movieList), fileName);
            }
        }).catch((error: any) => console.error(error));
    }

    addMovieList(moviesToAdd: Movie[], fileName: string): void {
        this.downloadFile(fileName).then(file => {
            const movieList = <Movie[]>JSON.parse(file);
            const found = moviesToAdd.filter((add: Movie) => !movieList.map((movie: Movie) => movie.id).includes(add.id));

            if (found.length > 0) {
                found.forEach((movie: Movie) => movieList.push(movie));
                movieList.sort(this.compareMovie);
                this.uploadFile(this.movieToBlob(movieList), fileName);
            }
        }).catch((error: any) => console.error(error));
    }

    removeMovie(id: number, fileName: string): void {
        this.downloadFile(fileName).then(file => {
            const movieList = <Movie[]>JSON.parse(file);
            this.uploadFile(this.movieToBlob(movieList.filter((film: Movie) => film.id !== id)), fileName);
        }).catch((error: any) => console.error(error));
    }

    removeMovieList(idToRemove: number[], fileName: string): void {
        this.downloadFile(fileName).then(file => {
            let movieList = <Movie[]>JSON.parse(file);

            if (idToRemove.length > 0) {
                idToRemove.forEach((id: number) => movieList = movieList.filter((film: Movie) => film.id !== id));
                this.uploadFile(this.movieToBlob(movieList), fileName);
            }
        }).catch((error: any) => console.error(error));
    }

    getAllMovies(fileName: string): Promise<Movie[]> {
        return this.downloadFile(fileName).then(file => {
            return <Movie[]>JSON.parse(file);
        }).catch((error: any) => {
            console.error(error);
            return new Promise((resolve, reject) => { });
        });
    }
    /**
     * @param  {Movie[]} movies
     * @returns any
     */
    movieToBlob(movies: Movie[]): any {
        const theJSON = JSON.stringify(movies, this.removeFields);
        return new Blob([theJSON], { type: 'text/json' });
    }

    removeFields(key: any, value: any): any {
        if (['synopsis', 'actors', 'crew', 'recommendations', 'videos', 'images'].includes(key)) {
            return undefined;
        }
        return value;
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
            movieList.sort(this.compareMovie);
            this.uploadFile(this.movieToBlob(movieList), fileName);
        }).catch((error: any) => console.error(error));
    }

    compareMovie(a: Movie, b: Movie): number {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }
}
