import { Injectable }    from '@angular/core';
import Dropbox = require('dropbox');

var token = 'G-_ZeiEAvB0AAAAAAAANQd4IMHRr7Y9aTvAiivg-8LImbDKmo9pdu95_SIioW3lR';
var folder = '/MyMovies/';

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

    uploadFile(fichier: any, fileName: string): void {
        let pathFile = folder + fileName;
        this.getDbx().filesDeleteV2({ path: pathFile })
            .then((response: any) => console.log(response))
            .catch((error: any) => console.error(error));
        this.getDbx().filesUpload({ path: pathFile, contents: fichier })
            .then((response: any) => console.log(response))
            .catch((error: any) => console.error(error));
    }
}