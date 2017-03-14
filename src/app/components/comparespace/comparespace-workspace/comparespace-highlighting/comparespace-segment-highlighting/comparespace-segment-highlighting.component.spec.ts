/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ComparespaceSegmentHighlightingComponent } from './comparespace-segment-highlighting.component';

describe('ComparespaceSegmentHighlightingComponent', () => {
  let component: ComparespaceSegmentHighlightingComponent;
  let fixture: ComponentFixture<ComparespaceSegmentHighlightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparespaceSegmentHighlightingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparespaceSegmentHighlightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
