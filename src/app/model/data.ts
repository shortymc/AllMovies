import { Genre } from './model';

export class DataI18N {
  constructor(public name: string, public poster: string, public category: Genre[]) {
  }
}

export class Data {
  id: number;
  title: string;
  affiche: string;
  genres: Genre[];
  translation: Map<string, DataI18N>; // key: lang
  added: Date = new Date();
  lang_version = 'fr';
  checked: boolean;

  constructor() { }

  removeFields(key: string, value: string): string {
    console.log('removeFields');
    return value;
  }
}
