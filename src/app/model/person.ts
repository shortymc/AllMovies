import {Serie} from './serie';
import {Movie} from './movie';

export class Person {
  constructor(
    public id?: number,
    public name?: string,
    public gender?: number,
    public birthday?: string,
    public deathday?: string,
    public profile?: string,
    public biography?: string,
    public adult?: boolean,
    public birthPlace?: string,
    public images?: string[],
    public asActor?: Movie[] | Serie[],
    public asDirector?: Movie[] | Serie[],
    public asProducer?: Movie[] | Serie[],
    public asCompositors?: Movie[] | Serie[],
    public asScreenplay?: Movie[] | Serie[],
    public asNovel?: Movie[] | Serie[],
    public asOther?: Movie[] | Serie[],
    public knownFor?: string,
    public popularity?: number,
    public imdb_id?: string
  ) {}
}
