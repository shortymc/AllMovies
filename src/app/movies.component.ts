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
    selectedMovie: Movie;
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
    onSelect(movie: Movie): void {
        this.selectedMovie = movie;
    };
    gotoDetail(): void {
        this.router.navigate(['/detail', this.selectedMovie.id]);
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
//        this.tableWidget = exampleId.DataTable();
    	$('#example').DataTable({
            data: this.movies,
            columns: [
                { data: "id", title: "Id" },
                { data: "title", title: "Titre" },
                { data: "date", title: "Date" }
            ],
            "lengthMenu": [[25, 50, -1], [25, 50, "Tous"]],
            "scrollY":        "500px",
            "scrollCollapse": true,
            "language": {
                "lengthMenu": "Affiche _MENU_ films par page",
                "zeroRecords": "Aucun film trouv&eacute;",
                "info": "_PAGE_ page sur _PAGES_ pages",
                "infoEmpty": "Aucun film trouv&eacute;",
                "infoFiltered": "(filtr&eacute; sur _MAX_ au total)",
                "decimal": ",",
                "thousands": " "
            }
    	});
    }
}
