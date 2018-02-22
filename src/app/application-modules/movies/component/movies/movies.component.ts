import { DropboxService } from './../../../../service/dropbox.service';
import { Movie } from './../../../../model/movie';
import { MovieService } from './../../../../service/movie.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
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
  constructor(private movieService: MovieService, private router: Router, private dropboxService: DropboxService) { }
  getMovies(): void {
    this.dropboxService.getAllMovies('ex.json').then(movies => {
      this.movies = movies;
      this.checkAndFixData();
      this.initDatatable();
    });
  }
  ngOnInit(): void {
    this.getMovies();
  }
  checkAndFixData(): void {
    let incomplete: number[] = [];
    const movieList = this.movies;
    for (const movie of this.movies) {
      if ((movie.time === undefined && movie.time == null)
        || (movie.genres === undefined && movie.genres == null)) {
        incomplete.push(movie.id);
      }
    }
    incomplete = incomplete.slice(0, 20);
    const obs = incomplete.map((id: number) => {
      return this.movieService.getMovie(id, false, false, false, false);
    });

    forkJoin(obs).subscribe(
      data => {
        console.log(data);
        this.dropboxService.replaceMovies(data, 'ex.json');
      },
      err => console.error(err)
    );
  }
  gotoDetail(id: number): void {
    window.open('/detail/' + id);
  }
  //    add(name: string): void {
  //        name = name.trim();
  //        if (!name) { return; }
  //        this.movieService.create(name)
  //            .then(movie => {
  //                this.movies.push(movie);
  //                this.selectedMovie = null;
  //            });
  //    }
  //    delete(movie: Movie): void {
  //        this.movieService
  //            .delete(movie.id)
  //            .then(() => {
  //                this.movies = this.movies.filter(h => h !== movie);
  //                if (this.selectedMovie === movie) { this.selectedMovie = null; }
  //            });
  //    }

  private initDatatable(): void {
    const tableWidget = $('#example').DataTable({
      data: this.movies,
      columns: [
        { data: 'id', title: 'Id', 'orderable': false },
        {
          data: 'thumbnail', title: 'Affiche', 'orderable': false, 'render': function (url, type, full) {
            return '<img class="posterDT" src="' + url + '"/>';
          }
        },
        { data: 'title', title: 'Titre', 'orderable': false },
        { data: 'original_title', title: 'Titre VO', 'orderable': false },
        { data: 'date', title: 'Date' },
        { data: 'note', title: 'Note' },
        { data: 'language', title: 'Langue' },
        {
          data: 'genres', title: 'Genres', 'render': function (genres, type, full) {
            return `<div>` + genres + `</div>`;
          }
        },
        { data: null, title: 'Dur&eacute;e' },
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
                  result += Math.floor(minute / 60) + ' heures ';
                  result += minute % 60 + ' minutes';
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
          'defaultContent': `<button class="btn btn-outline-primary detail">
                                Voir d&eacute;tails <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                             </button>`
        },
        {
          'targets': -2,
          'orderable': false,
          'data': null,
          'defaultContent': '<button class="btn btn-outline-primary remove">Remove <i class="fa fa-times" aria-hidden="true"></i></button>'
        }
      ],
      'order': [[4, 'desc']],
      'lengthMenu': [[15, 30, 50, -1], [15, 30, 50, 'Tous']],
      'scrollY': '70vh',
      'scrollCollapse': true,
      'language': {
        'processing': 'Traitement en cours...',
        'search': 'Rechercher&nbsp;:',
        'lengthMenu': 'Afficher _MENU_ &eacute;l&eacute;ments',
        'info': 'Affichage de l\'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
        'infoEmpty': 'Affichage de l\'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment',
        'infoFiltered': '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
        'infoPostFix': '',
        'loadingRecords': 'Chargement en cours...',
        'zeroRecords': 'Aucun &eacute;l&eacute;ment &agrave; afficher',
        'emptyTable': 'Aucune donn&eacute;e disponible dans le tableau',
        'paginate': {
          'first': 'Premier',
          'previous': 'Pr&eacute;c&eacute;dent',
          'next': 'Suivant',
          'last': 'Dernier'
        },
        'aria': {
          'sortAscending': ': activer pour trier la colonne par ordre croissant',
          'sortDescending': ': activer pour trier la colonne par ordre d&eacute;croissant'
        }
      }
    });

    $(document).on('click', '.detail', ($event) => {
      this.gotoDetail((<any>$($event)[0]).currentTarget.parentElement.parentElement.children[0].innerText);
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
        <input type="text" class="align-center myFilter" placeholder="Rechercher dans les " + title.toLowerCase() + "s" />`);
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
