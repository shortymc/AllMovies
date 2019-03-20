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

  static clone(tag: Tag): Tag {
    const cloneTag = { ...tag };
    cloneTag.movies = Array.from(tag.movies);
    return cloneTag;
  }
}
