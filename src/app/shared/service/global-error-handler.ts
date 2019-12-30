import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorService } from './error.service';
import { ToastService } from './toast.service';
import { Level } from './../../model/model';
import { DropboxService } from './dropbox.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse): void {

        const errorService = this.injector.get(ErrorService);
        const notifier = this.injector.get(ToastService);
        const dropbox = this.injector.get(DropboxService);

        let message;
        let stackTrace;

        if (error instanceof HttpErrorResponse) {
            // Server Error
            message = errorService.getServerMessage(error);
            stackTrace = errorService.getServerStack(error);
            notifier.open(Level.error, message);
        } else {
            // Client Error
            message = errorService.getClientMessage(error);
            stackTrace = errorService.getClientStack(error);
            notifier.open(Level.error, message);
        }

        // Always log errors
        console.error('message', message);
        console.error('stackTrace', stackTrace);

        console.error('error', error);

        dropbox.uploadNewFile([message, stackTrace, error], 'error' + new Date().getTime() + '.txt');
    }
}
