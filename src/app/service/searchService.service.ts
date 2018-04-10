import { Observable } from 'rxjs/Observable';

export interface SearchServiceService {

  search(term: string, adult?: boolean, language?: string): Observable<any[]>;
}
