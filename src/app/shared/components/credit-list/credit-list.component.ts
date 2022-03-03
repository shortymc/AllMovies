import {Component, OnInit, Input} from '@angular/core';
import {Job} from './../../../constant/job';
import {Person} from '../../../model/person';

@Component({
  selector: 'app-credit-list',
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.scss'],
})
export class CreditListComponent implements OnInit {
  @Input()
  creators: Person[] = [];
  @Input()
  actors: Person[] = [];
  @Input()
  crew: Person[] = [];
  @Input()
  isDetail!: boolean;
  Job = Job;

  constructor() {}

  ngOnInit(): void {}
}
