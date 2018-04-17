import { Component, OnInit, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input('visible') visible: boolean;

  constructor() { }

  ngOnInit() {
    console.log('this.visible');
    console.log(this.visible);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const field of Object.keys(changes)) {
      if (field === 'visible') {
        const changedProp = changes[field];
        this.visible = changedProp.currentValue;
      }
    }
  }

  show() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

}
