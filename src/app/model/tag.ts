export class TagMovie {
  id: number;
  title: string;
  lang_version = 'fr';
  checked: boolean;
}

export class Tag {
  id: number;
  label: string;
  checked: boolean;
  movies: TagMovie[];
}
