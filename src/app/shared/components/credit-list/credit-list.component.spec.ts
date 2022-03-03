/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CreditListComponent} from './credit-list.component';

describe('CreditListComponent', () => {
  let component: CreditListComponent;
  let fixture: ComponentFixture<CreditListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CreditListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
