import { Observable } from 'rxjs';

export interface SearchService<T> {

  search(term: string, adult?: boolean, language?: string): Observable<T[]>;

  byId(id: any): Observable<T>;
}
