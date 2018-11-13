import { Lang } from './model';

export class User {
  constructor(
    public id: number,
    public name: string,
    public password: string,
    public question?: string,
    public answer?: string,
    public lang?: Lang
  ) { }
}
