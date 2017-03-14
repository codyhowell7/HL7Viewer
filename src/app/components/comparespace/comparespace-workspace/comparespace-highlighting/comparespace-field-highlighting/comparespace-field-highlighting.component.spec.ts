/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ComparespaceFieldHighlightingComponent } from './comparespace-field-highlighting.component';

describe('ComparespaceFieldHighlightingComponent', () => {
  let component: ComparespaceFieldHighlightingComponent;
  let fixture: ComponentFixture<ComparespaceFieldHighlightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparespaceFieldHighlightingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparespaceFieldHighlightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
