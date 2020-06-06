import { Component, OnInit, Input } from '@angular/core';

import { Person } from '../../../model/person';
import { ImageSize } from '../../../model/model';
import { Url } from '../../../constant/url';

@Component({
  selector: 'app-list-persons',
  templateUrl: './list-persons.component.html',
  styleUrls: ['./list-persons.component.scss']
})
export class ListPersonsComponent implements OnInit {
  @Input()
  persons: Person[];
  @Input()
  label: string;
  Url = Url;
  imageSize = ImageSize;
  limit = 6;
  showAll = false;

  constructor() { }

  ngOnInit(): void {
  }

}
