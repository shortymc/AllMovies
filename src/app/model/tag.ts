import { Data } from './data';
import { Utils } from '../shared/utils';

export class TagData {
  id: number;
  poster: string;
  titles: Map<string, string>; // key: lang, value: title
  movie: boolean;
  checked: boolean;

  static toJson(data: TagData): string {
    const titles = Utils.mapToJson(<Map<any, any>>data.titles);
    const json = JSON.stringify(data, TagData.removeFields);
    return json.replace('"titles":{}', '"titles":' + titles);
  }

  static fromData(data: Data[] | Data, isMovie: boolean): TagData {
    const tagData = new TagData();
    tagData.titles = new Map();
    tagData.movie = isMovie;
    if (Array.isArray(data)) {
      if (!data || data.length !== 2 || data[0].id !== data[1].id) {
        console.error('Incorrect datas', data);
        throw new Error('Incorrect datas in TagData#fromData');
      }
      tagData.id = data[0].id;
      tagData.poster = data[0].affiche;
      tagData.titles.set(data[0].lang_version, data[0].title);
      tagData.titles.set(data[1].lang_version, data[1].title);
    } else {
      if (!data || !data.translation) {
        console.error('Incorrect data', data);
        throw new Error('Incorrect data in TagData#fromData');
      }
      tagData.id = data.id;
      tagData.poster = data.translation.get('fr').poster;
      data.translation.forEach((value, key) => tagData.titles.set(key, value.name));
    }
    return tagData;
  }

  static removeFields(key: string, value: string): string {
    if (['checked'].includes(key)) {
      return undefined;
    }
    return value;
  }
}

export class Tag {
  id: number;
  label: string;
  color: string;
  checked: boolean;
  datas: TagData[];

  static clone(tag: Tag): Tag {
    const cloneTag = { ...tag };
    cloneTag.datas.forEach(m => m.titles = new Map(m.titles));
    cloneTag.datas = Array.from(tag.datas);
    return cloneTag;
  }

  static toJson(tag: Tag): string {
    const temp: any = Tag.clone(tag);

    temp.datas = temp.datas.map(d => TagData.toJson(d));
    const datas = temp.datas;
    temp.datas = undefined;

    const json = JSON.stringify(temp, TagData.removeFields);
    return json.substr(0, json.length - 1) + ',"datas":[' + datas + ']}';
  }
}
