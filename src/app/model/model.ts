
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
