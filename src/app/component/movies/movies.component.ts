import { Component, OnInit } from '@angular/core';
import { Movie } from '../../movie';
import { MovieService } from '../../movie.service';
import { Router } from '@angular/router';
import { DropboxService } from '../../dropbox.service';

@Component({
    selector: 'my-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.css']
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
    ngAfterViewInit() {
    }
    ngOnInit(): void {
        this.getMovies();
    }
    checkAndFixData(): void {
        let idIncomplete = new Set();
        for (let movie of this.movies) {
            if (movie.time == undefined && movie.time == null) {
                idIncomplete.add(movie.id);
            }
        }
        //        idIncomplete.forEach((id: number) => this.movies = this.movies.filter((film: Movie) => film.id != id));
        //        this.dropboxService.removeMovieList([...idIncomplete], 'ex.json')
        //        let complete:Movie[] = [];
        //        for(let id of idIncomplete) {
        //            this.movieService.getMovie(id, false, false, false, false).then(data => complete.push(data));
        //        }
        //        console.log(complete);
        //        if(complete != undefined) {
        //            this.movies.concat(complete);
        //            this.dropboxService.addMovieList(complete, 'ex.json');
        //        }
    }
    gotoDetail(id: number): void {
        this.router.navigate(['/detail', id]);
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
        let tableWidget = $('#example').DataTable({
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
                                    let minute = <number>data.time;
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
                    'defaultContent': '<button class="btn btn-outline-primary detail">Voir d&eacute;tails <i class="fa fa-chevron-circle-right" aria-hidden="true"></i></button>'
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
            let tr = (<any>$($event)[0]).currentTarget.parentElement.parentElement;
            let id = tr.children[0].innerText;
            this.dropboxService.removeMovie(id, 'ex.json');
            tableWidget.row(tr).remove();
            tableWidget.draw();
        });
        $('th').not(':lt(2),:gt(2)').each(function () {
            let title = $('th').eq($(this).index()).text();
            $(this).append('<br/><input type="text" class="align-center myFilter" placeholder="Rechercher dans les " + title.toLowerCase() + "s" />');
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
