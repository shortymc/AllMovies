import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateService } from '@ngx-translate/core';
import { Injectable, Injector } from '@angular/core';

import { DropboxService } from './service/dropbox.service';
import { Dropbox } from '../constant/dropbox';
import { Constants } from '../constant/constants';
import { Utils } from './utils';

@Injectable()
export class MyMissingTranslationHandler implements MissingTranslationHandler {

    constructor(
        private injector: Injector
    ) { }

    static getDefaultTranslation(key: string, translateService: TranslateService): string {
        let defaultTrad = translateService.translations[translateService.defaultLang];
        for (const k of key.split('.')) {
            if (Utils.isNotBlank(defaultTrad)) {
                defaultTrad = defaultTrad[k];
            } else {
                defaultTrad = undefined;
                break;
            }
        }
        return defaultTrad;
    }

    handle(params: MissingTranslationHandlerParams): string {
        let defaultTrad;
        if (Constants.TRANSLATION_KEY_REGEX.test(params.key)) {
            console.log('missing translation', params.key);
            defaultTrad = MyMissingTranslationHandler.getDefaultTranslation(params.key, params.translateService);
            const dropbox = this.injector.get(DropboxService);
            dropbox.downloadFile(Dropbox.DROPBOX_TRANSLATION_FILE).then((file: string) => {
                if (file.split('\r\n').every(line => !line.endsWith(params.key))) {
                    dropbox.uploadFile(
                        new Blob([file.concat('\r\n' + (defaultTrad ? (params.translateService.currentLang + ': ') : '') + params.key)],
                            { type: 'text/plain;charset=utf-8' }),
                        Dropbox.DROPBOX_TRANSLATION_FILE);
                }
            });
        }
        return defaultTrad ? defaultTrad : params.key;
    }
}
