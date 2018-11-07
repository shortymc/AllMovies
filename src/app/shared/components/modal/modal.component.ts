import { Component, OnInit, Input, SimpleChange, Output, EventEmitter, OnChanges } from '@angular/core';
import { faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean;
  @Input() closeBtn: IconDefinition;
  @Output() update = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    if (!this.closeBtn) {
      this.closeBtn = faTimes;
    }
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
    this.update.emit(this.visible);
  }

  close() {
    this.visible = false;
    this.update.emit(this.visible);
  }

}
