import { Component, OnInit } from '@angular/core';

import { MyTagsService } from './../../../../shared/service/my-tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  constructor(
    private myTagsService: MyTagsService
  ) { }

  ngOnInit() {
    this.myTagsService.getAll();
  }

}
