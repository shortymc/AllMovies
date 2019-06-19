import { Movie } from "./movie";

export enum Direction {
  Up = 'Up',
  Down = 'Down'
}

export enum Level {
  info = 'info',
  warning = 'warning',
  success = 'success',
  error = 'error'
}

export class DropDownChoice {
  label_key: string;
  value: any;

  constructor(label_key: string, value: any) {
    this.label_key = label_key;
    this.value = value;
  }
}

export class GroupBy<T> {
  key: string;
  items: T[];

  constructor(key: string, items: T[]) {
    this.key = key;
    this.items = items;
  }
}

export class Keyword {
  id: number;
  name: string;
}

export class Genre {
  id: number;
  name: string;
}

export class List {
  id: number;
  name: string;
  description: string;
  list_type: 'movie' | 'tv';
  poster_path: string;
  item_count: number;
  favorite_count: number;
}

export class Paginate<T> {
  constructor(public page: number, public results: T[], public total_pages: number, public total_results: number) { }
}

export class FullList {
  id: number;
  name: string;
  poster_path: string;
  description: string;
  paginate: Paginate<Movie>;
  lang: string;
  country: string;
  average_rating: number;
  runtime: number;
  revenue: string;
}

export class Network {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export class Certification {
  certification: string;
  meaning: string;
  order: number;
}

export class Flag {
  lang: string;
  country: string;
}

export class LangDb {
  id: string;
  name: string;
}

export class Lang {
  id: number;
  code: string;
  label: string;
  icon: string;
}

export class Link {
  label: string;
  url: string;

  constructor(label: string, url: string) {
    this.label = label;
    this.url = url;
  }
}

export class ReleaseDate {
  constructor(public date: Date, public type: string) {
  }
}

export class AlternativeTitle {
  constructor(public lang: string, public title: string) {
  }
}

export class DetailConfig {
  constructor(public img?: boolean, public credit?: boolean, public similar?: boolean, public keywords?: boolean, public video?: boolean,
    public reco?: boolean, public release?: boolean, public titles?: boolean, public external?: boolean, public lang?: string) {
  }
}
