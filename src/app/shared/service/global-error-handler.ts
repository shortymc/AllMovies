import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
        const router = this.injector.get(Router);
        const datePipe = this.injector.get(DatePipe);

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
        
        console.error('url', router.url);

        dropbox.uploadNewFile([router.url, message, stackTrace, error], 'logs/error-' + datePipe.transform(new Date(), 'yyyy.MM.dd-HH.mm.ss.SSS') + '.txt');
    }
}
