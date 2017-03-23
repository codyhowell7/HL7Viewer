/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuickViewSelectAllComponent } from './quick-view-select-all.component';

describe('QuickViewSelectAllComponent', () => {
  let component: QuickViewSelectAllComponent;
  let fixture: ComponentFixture<QuickViewSelectAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickViewSelectAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
