import { Injectable }    from '@angular/core';
import Dropbox = require('dropbox');
import 'rxjs/add/operator/toPromise';

var token = 'G-_ZeiEAvB0AAAAAAAANQd4IMHRr7Y9aTvAiivg-8LImbDKmo9pdu95_SIioW3lR';
var folder = '/MyMovies/';
import { Movie } from './movie';

@Injectable()
export class DropboxService {
    constructor() { }

    getDbx(): any {
        return new Dropbox({ accessToken: token });
    }

    listFiles(): void {
        this.getDbx().filesListFolder({ path: '' })
            .then((response: any) => console.log(response.entries))
            .catch((error: any) => console.error(error));
    }

    getPath(fileName: string): string {
        return folder + fileName;
    }

    uploadFile(fichier: any, fileName: string): void {
        let pathFile = this.getPath(fileName);
        this.getDbx().filesDeleteV2({ path: pathFile })
            .then((response: any) => {
                this.getDbx().filesUpload({ path: pathFile, contents: fichier })
                    .then((response: any) => console.log(response))
                    .catch((error: any) => console.error(error));
            })
            .catch((error: any) => console.error(error));
    }

    downloadFile(fileName: string): Promise<string> {
        return this.getDbx().filesDownload({ path: this.getPath(fileName) })
            .then((response: any) => {
                return new Promise((resolve, reject) => {
                    const fileReader = new FileReader()
                    fileReader.onload = (event) => resolve(fileReader.result as string)
                    fileReader.onabort = (event) => reject(event)
                    fileReader.onerror = (event) => reject(event)
                    fileReader.readAsText(response.fileBlob)
                }) as Promise<string[]>
            })
            .catch((error: any) => console.error(error));
    }

    addMovie(movie: Movie, fileName: string): void {
        this.downloadFile(fileName).then(file => {
            let movieList = <Movie[]>JSON.parse(file);
            let found = movieList.find(function(film) {
                return film.id === movie.id;
            });
            if (!found) {
                movieList.push(movie);
                movieList.sort(this.compareMovie);
                this.uploadFile(this.movieToBlob(movieList), fileName);
            }
        }).catch((error: any) => console.error(error));
    }

    removeMovie(id: number, filename: string): void {

    }

    getAllMovies(fileName: string): Promise<Movie[]> {
        return this.downloadFile(fileName).then(file => {
            return <Movie[]>JSON.parse(file);
        }).catch((error: any) => console.error(error));
    }

    movieToBlob(movies: Movie[]): any {
        let theJSON = JSON.stringify(movies, this.removeFields);
        return new Blob([theJSON], { type: 'text/json' });
    }

    removeFields(key: any, value: any): any {
        if (['synopsis', 'actors', 'crew'].includes(key)) {
            return undefined;
        }
        return value;
    }

    compareMovie(a: Movie, b: Movie): number {
        if (a.id < b.id)
            return -1;
        if (a.id > b.id)
            return 1;
        return 0;
    }
}
