import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const movies = [
      { id: 0,  title: 'Dr. No', year: 2017 },
      { id: 11, title: 'Mr. Nice', year: 2016 },
      { id: 12, title: 'Narco', year: 1986 },
      { id: 13, title: 'Apocalypse Now', year: 1963 },
      { id: 14, title: 'Jet Set', year: 2005 },
      { id: 15, title: 'Magneto', year: 2009 },
      { id: 16, title: 'Taxi Driver', year: 1999 },
      { id: 17, title: 'Slumdog Millionaire', year: 1975 },
      { id: 18, title: 'Star Wars', year: 1986 },
      { id: 19, title: 'Volcano', year: 1987 },
      { id: 20, title: 'X-Men', year: 1956 }
    ];
    return {movies};
  }
}