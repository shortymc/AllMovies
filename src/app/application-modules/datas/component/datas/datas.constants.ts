export class DatasConstants {
    static readonly INIT_COLUMNS_SERIES = ['id', 'thumbnail', 'name', 'seasonCount', 'firstAired', 'vote', 'inProduction',
        'originLang', 'genres', 'runtimes', 'added', 'select', 'details', 'tag-icon'];
    static readonly INIT_COLUMNS_MOVIES = ['id', 'thumbnail', 'name', 'original_title', 'date', 'vote', 'meta', 'language',
        'time', 'genres', 'added', 'select', 'details', 'tag-icon'];
    static readonly MEDIUM_COLUMNS_SERIES = ['thumbnail', 'name', 'firstAired', 'vote', 'inProduction', 'originLang',
        'genres', 'runtimes', 'added', 'select', 'details', 'tag-icon'];
    static readonly MEDIUM_COLUMNS_MOVIES = ['thumbnail', 'name', 'date', 'vote', 'meta', 'language', 'time', 'genres',
        'added', 'select', 'details', 'tag-icon'];
    static readonly MOBILE_COLUMNS_SERIES = ['thumbnail', 'name', 'details', 'firstAired', 'inProduction', 'originLang',
        'runtimes', 'genres', 'select', 'tag-icon'];
    static readonly MOBILE_COLUMNS_MOVIES = ['thumbnail', 'name', 'details', 'date', 'meta', 'language', 'time', 'genres',
        'select', 'tag-icon'];
}
