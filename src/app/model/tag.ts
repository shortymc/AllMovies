export class TagMovie {
  id: number;
  title: string;
  lang_version = 'fr';
}

export class Tag {
  id: number;
  label: string;
  checked: boolean;
  movies: TagMovie[];
}
