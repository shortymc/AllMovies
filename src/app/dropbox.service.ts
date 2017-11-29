import { Injectable }    from '@angular/core';
import Dropbox = require('dropbox');
import 'rxjs/add/operator/toPromise';

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

    downloadFile(fileName: string): Promise<string[]> {
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
}