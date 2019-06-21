import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { FullList, DropDownChoice, Genre } from '../../../../model/model';
import { ListService, TitleService, GenreService } from '../../../../shared/shared.module';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnInit {
  @ViewChild('sortDir') sortDir: any;
  id: number;
  list: FullList;
  sortChoices: DropDownChoice[];
  sortChosen: DropDownChoice;
  page: PageEvent;
  allGenres: Genre[];
  genresLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  nbChecked = 0;
  subs = [];

  constructor(
    private translate: TranslateService,
    private listService: ListService,
    private genreService: GenreService,
    private route: ActivatedRoute,
    private title: TitleService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.title.setTitle('title.list');
    this.sortChoices = [new DropDownChoice('list.sort_field.original_order', 'original_order'),
    new DropDownChoice('list.sort_field.release_date', 'release_date'), new DropDownChoice('list.sort_field.vote_average', 'vote_average'),
    new DropDownChoice('list.sort_field.title', 'title')];
    this.id = +this.route.snapshot.paramMap.get('id');
    this.getAllGenres();
    this.subs.push(this.translate.onLangChange.subscribe(() => {
      console.log('trd');
      this.getAllGenres();
      // this.search();
    }));
    // Stored params
    this.subs.push(this.route.queryParams.subscribe(
      params => {
        console.log('params', params);
        this.nbChecked = 0;
        this.sortChosen = this.sortChoices.find(choice => choice.value === (params.sortField ? params.sortField : 'original_order'));
        this.sortDir.value = params.sortDir ? params.sortDir : 'desc';
        this.page = new PageEvent();
        this.page.pageIndex = params.page ? params.page : 0;
        this.search();
      }));
  }

  search(): void {
    console.log('search');
    this.listService.getListDetail(this.id, this.translate.currentLang, this.sortChosen.value + '.' + this.sortDir.value, +this.page.pageIndex + 1)
      .then(result => {
        this.list = result;
        this.title.setTitle(this.list.name);
      });
  }

  query(page: number, sortField: string, sortDir: string): void {
    console.log(sortField);
    console.log(sortDir);
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        page: page, sortField: sortField, sortDir: sortDir
      }
    });
  }

  updateSize(): void {
    // this.nbChecked = this.discover.datas.filter(d => d.checked).length;
  }

  getAllGenres(): void {
    this.genresLoaded$.next(false);
    this.subs.push(this.genreService.getAllGenre(true, this.translate.currentLang).subscribe(genres => {
      this.allGenres = genres;
      this.genresLoaded$.next(true);
    }));
  }

  getGenre(genreId: number): string {
    const find = this.allGenres.find(genre => genre.id === genreId);
    return find ? find.name : '';
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}