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

export class Keyword {
  id: number;
  name: string;
}

export class Genre {
  id: number;
  name: string;
}

export class Certification {
  certification: string;
  meaning: string;
  order: number;
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

export class MovieDetailConfig {
  constructor(public img?: boolean, public credit?: boolean, public similar?: boolean, public keywords?: boolean,
    public video?: boolean, public reco?: boolean, public release?: boolean, public titles?: boolean, public lang?: string) {
  }
}
