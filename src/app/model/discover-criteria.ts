export class DiscoverCriteria {
  constructor(public language: string, public sortField: string, public sortDir: string, public page: number, public yearMin?: number,
    public yearMax?: number, public adult?: boolean, public voteAvergeMin?: number, public voteAvergeMax?: number,
    public voteCountMin?: number, public certification?: string, public runtimeMin?: number, public runtimeMax?: number,
    public releaseType?: number[], public personsIds?: number[], public genresId?: number[], public genresWithout?: boolean,
    public keywordsIds?: number[], public keywordsWithout?: boolean) { }
}
