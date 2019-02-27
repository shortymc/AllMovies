import { Observable } from 'rxjs';

export interface SearchServiceService<T> {

  search(term: string, adult?: boolean, language?: string): Observable<T[]>;

  byId(id: number): Observable<T>;
}
