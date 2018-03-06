import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DropboxService } from './../../../../service/dropbox.service';
import { Movie } from './../../../../model/movie';
import { MovieService } from './../../../../service/movie.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import * as $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-my-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Movie[];
  public tableWidget: any;
  constructor(private movieService: MovieService, private router: Router,
    private dropboxService: DropboxService, private translate: TranslateService) { }

  getMovies(): void {
    this.dropboxService.getAllMovies('ex.json').then(movies => {
      this.movies = movies;
      this.checkAndFixData();
      this.addAnchor();
      this.initDatatable();
    });
  }

  ngOnInit(): void {
    this.getMovies();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getMovies();
    });
  }

  checkAndFixData(): void {
    let incomplete: number[] = [];
    for (const movie of this.movies) {
      if ((movie.time === undefined && movie.time == null)
        || (movie.genres === undefined && movie.genres == null)
        || (movie.original_title === undefined || movie.original_title == null || movie.original_title === '')) {
          incomplete.push(movie.id);
        }
      }
    incomplete = incomplete.slice(0, 20);
    const obs = incomplete.map((id: number) => {
      return this.movieService.getMovie(id, false, false, false, false, 'fr');
    });

    forkJoin(obs).subscribe(
      data => {
        console.log(data);
        this.dropboxService.replaceMovies(data, 'ex.json');
      },
      err => console.error(err)
    );
  }

  gotoDetail(id: number, key): void {
    if (key === 1) {
      this.router.navigate(['movie', id]);
    } else if (key === 2) {
      window.open('/movie/' + id);
    }
  }

  addAnchor() {
    $('#example_wrapper').remove();
    $('h2').after(`<table id='example' class='table table-striped table-bordered
      compact hover order-column align-center' cellspacing='0'></table>`);
  }

  private initDatatable(): void {
    const comp = this;
    const tableWidget = $('#example').DataTable({
      data: this.movies,
      columns: [
        { data: 'id', title: comp.translate.instant('movies.id'), 'orderable': false },
        {
          data: 'thumbnail', title: comp.translate.instant('movies.poster'), 'orderable': false, 'render': function (url, type, full) {
            return '<img class="posterDT" src="' + url + '"/>';
          }
        },
        { data: 'title', title: comp.translate.instant('movies.title'), 'orderable': false },
        { data: 'original_title', title: comp.translate.instant('global.original_title'), 'orderable': false },
        { data: 'date', title: comp.translate.instant('movies.date') },
        { data: 'note', title: comp.translate.instant('movies.rating') },
        { data: 'language', title: comp.translate.instant('movies.language') },
        {
          data: 'genres', title: comp.translate.instant('movies.genres'), 'render': function (genres, type, full) {
            return `<div>` + genres + `</div>`;
          }
        },
        { data: null, title: comp.translate.instant('movies.length') },
        { data: null, title: '' },
        { data: null, title: '' }
      ],
      'columnDefs': [
        {
          'targets': -3,
          'orderable': true,
          'render': function (data, type, row) {
            if (data.time !== undefined && data.time != null) {
              if (type === 'display') {
                try {
                  const minute = <number>data.time;
                  let result = '';
                  result += Math.floor(minute / 60) + ' ' + comp.translate.instant('time.hour') + ' ';
                  result += minute % 60 + ' ' + comp.translate.instant('time.minute') + ' ';
                  return result;
                } catch (e) {
                  console.error('error', e.message);
                }
              } else {
                return data.time;
              }
            } else {
              return '0';
            }
          }
        },
        {
          'targets': -1,
          'orderable': false,
          'data': null,
          'defaultContent': `<button class="btn btn-outline-primary detail">` +
            comp.translate.instant('global.go_detail') + ` <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                             </button>`
        },
        {
          'targets': -2,
          'orderable': false,
          'data': null,
          'defaultContent': `<button class="btn btn-outline-primary remove">` +
            comp.translate.instant('global.remove') + ` <i class="fa fa-times" aria-hidden="true"></i></button>`
        }
      ],
      'order': [[4, 'desc']],
      'lengthMenu': [[15, 30, 50, -1], [15, 30, 50, 'Tous']],
      'scrollY': '70vh',
      'scrollCollapse': true,
      'language': {
        'processing': comp.translate.instant('movies.dt.processing'),
        'search': comp.translate.instant('movies.dt.search'),
        'lengthMenu': comp.translate.instant('movies.dt.lengthMenu'),
        'info': comp.translate.instant('movies.dt.info'),
        'infoEmpty': comp.translate.instant('movies.dt.infoEmpty'),
        'infoFiltered': comp.translate.instant('movies.dt.infoFiltered'),
        'infoPostFix': comp.translate.instant('movies.dt.infoPostFix'),
        'loadingRecords': comp.translate.instant('movies.dt.loadingRecords'),
        'zeroRecords': comp.translate.instant('movies.dt.zeroRecords'),
        'emptyTable': comp.translate.instant('movies.dt.emptyTable'),
        'paginate': {
          'first': comp.translate.instant('movies.dt.first'),
          'previous': comp.translate.instant('movies.dt.previous'),
          'next': comp.translate.instant('movies.dt.next'),
          'last': comp.translate.instant('movies.dt.last')
        },
        'aria': {
          'sortAscending': comp.translate.instant('movies.dt.sortAscending'),
          'sortDescending': comp.translate.instant('movies.dt.sortDescending')
        }
      }
    });

    $(document).on('mousedown', '.detail', ($event) => {
      const event = (<any>$($event)[0]);
      this.gotoDetail(event.currentTarget.parentElement.parentElement.children[0].innerText, event.originalEvent.which);
    });
    $(document).on('click', '.remove', ($event) => {
      const tr = (<any>$($event)[0]).currentTarget.parentElement.parentElement;
      const id = tr.children[0].innerText;
      this.dropboxService.removeMovie(id, 'ex.json');
      tableWidget.row(tr).remove();
      tableWidget.draw();
    });
    $('th').not(':lt(2),:gt(2)').each(function () {
      const title = $('th').eq($(this).index()).text();
      $(this).append(`<br/>
        <input type="text" class="align-center myFilter" placeholder="`
        + comp.translate.instant('movies.search_title', { param: title.toLowerCase() }) + `" />`);
    });
    tableWidget.columns().eq(0).each(function (colIdx) {
      $('input', tableWidget.column(colIdx).header()).on('keyup change', function () {
        tableWidget
          .column(colIdx)
          .search((<any>this).value).draw();
      });
    });
  }
}
