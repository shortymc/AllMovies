import { Serie } from './serie';
import { Movie } from './movie';

export class Discover {
  constructor(public datas?: (Serie | Movie)[], public page?: number, public total_results?: number, public total_pages?: number) { }
}
