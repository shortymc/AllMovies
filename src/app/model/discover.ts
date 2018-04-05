import { Movie } from './movie';

export class Discover {
  constructor(public movies?: Movie[], public page?: number, public total_results?: number, public total_pages?: number) { }
}
