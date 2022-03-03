import {Component, OnInit, Input} from '@angular/core';

type Video = {key: string; name: string};

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  @Input()
  videos: Video[] = [];

  constructor() {}

  ngOnInit(): void {}
}
