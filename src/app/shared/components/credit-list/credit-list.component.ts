import { Component, OnInit, Input } from '@angular/core';
import { Job } from './../../../constant/job';

@Component({
  selector: 'app-credit-list',
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.scss']
})
export class CreditListComponent implements OnInit {
  @Input()
  creators: any[];
  @Input()
  actors: any[];
  @Input()
  crew: any[];
  @Input()
  isDetail: boolean;
  Job = Job;

  constructor() { }

  ngOnInit(): void {
  }

}
