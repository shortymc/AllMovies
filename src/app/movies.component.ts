import { Component, OnInit } from '@angular/core';
import { Movie } from './movie';
import { MovieService } from './movie.service';
import { Router } from '@angular/router';

@Component({
    selector: 'my-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.css']
})

export class MoviesComponent implements OnInit {
    movies: Movie[];
    public tableWidget: any;
    constructor(private movieService: MovieService, private router: Router) { }
    getMovies(): void {
        this.movieService.getMovies().then(movies => {
            this.movies = movies;
            this.initDatatable();
        });
    }
    ngAfterViewInit() {
    }
    ngOnInit(): void {
        this.getMovies();
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
        var tableWidget = $('#example').DataTable({
            data: this.movies,
            columns: [
                { data: "id", title: "Id", "orderable": false },
                {
                    data: "thumbnail", title: "Affiche", "orderable": false, "render": function(url, type, full) {
                        return '<img style="width: 20%;" src="' + url + '"/>';
                    }
                },
                { data: "title", title: "Titre", "orderable": false },
                { data: "date", title: "Date" },
                { data: "note", title: "Note" },
                { data: "language", title: "Langue" },
                { data: null, title: "" }
            ],
            "columnDefs": [{
                "targets": -1,
                "orderable": false,
                "data": null,
                "defaultContent": "<button class='btn btn-outline-primary detail'>Voir d&eacute;tails</button>"
            }],
            "order": [[4, "desc"]],
            "lengthMenu": [[25, 50, -1], [25, 50, "Tous"]],
            "scrollY": "70vh",
            "scrollCollapse": true,
            "language": {
                "processing": "Traitement en cours...",
                "search": "Rechercher&nbsp;:",
                "lengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
                "info": "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                "infoEmpty": "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
                "infoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                "infoPostFix": "",
                "loadingRecords": "Chargement en cours...",
                "zeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
                "emptyTable": "Aucune donn&eacute;e disponible dans le tableau",
                "paginate": {
                    "first": "Premier",
                    "previous": "Pr&eacute;c&eacute;dent",
                    "next": "Suivant",
                    "last": "Dernier"
                },
                "aria": {
                    "sortAscending": ": activer pour trier la colonne par ordre croissant",
                    "sortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
                }
            }
        });

        $(document).on('click', '.detail', ($event) => {
            this.gotoDetail((<any>$($event)[0]).currentTarget.parentElement.parentElement.children[0].innerText);
        });
        $('th').not(":lt(2),:gt(2)").each(function() {
            var title = $('th').eq($(this).index()).text();
            $(this).append('<br/><input type="text" class="align-center myFilter" placeholder="Rechercher dans les ' + title.toLowerCase() + 's" />');
        });
        tableWidget.columns().eq(0).each(function(colIdx) {
            $('input', tableWidget.column(colIdx).header()).on('keyup change', function() {
                tableWidget
                    .column(colIdx)
                    .search((<any>this).value).draw();
            });
        });
    }
}
