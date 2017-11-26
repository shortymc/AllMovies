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
    add(name: string): void {
        name = name.trim();
        if (!name) { return; }
        this.movieService.create(name)
            .then(movie => {
                this.movies.push(movie);
                this.selectedMovie = null;
            });
    }
    delete(movie: Movie): void {
        this.movieService
            .delete(movie.id)
            .then(() => {
                this.movies = this.movies.filter(h => h !== movie);
                if (this.selectedMovie === movie) { this.selectedMovie = null; }
            });
    }
    
    private initDatatable(): void {
        var tableWidget = $('#example').DataTable({
            data: this.movies,
            select: true,
            columns: [
                { data: "id", title: "Id" },
                { data: "title", title: "Titre" },
                { data: "date", title: "Date" },
                { data: null, title: "" }
            ],
            "columnDefs": [ {
                "targets": -1,
                "data": null,
            	"defaultContent": "<button class='btn btn-outline-primary detail'>View Details</button>"
            } ],
            "lengthMenu": [[25, 50, -1], [25, 50, "Tous"]],
            "scrollY":        "500px",
            "scrollCollapse": true,
            "language": {
                "lengthMenu": "Affiche _MENU_ films par page",
                "zeroRecords": "Aucun film trouv&eacute;",
                "info": "_PAGE_ page sur _PAGES_ pages",
                "infoEmpty": "Aucun film trouv&eacute;",
                "infoFiltered": "(filtr&eacute; sur _MAX_ au total)"
            }
    	});
        $(document).on('click', '.detail', ($event) => {
            this.gotoDetail($($event)[0].currentTarget.parentElement.parentElement.children[0].innerText);
        });
    }
}
