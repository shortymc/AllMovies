import { Observable } from 'rxjs/Observable';

export interface SearchServiceService<T> {

  search(term: string, adult?: boolean, language?: string): Observable<T[]>;
}
